import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from './auth.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

interface PendingSignup {
  username: string;
  email: string;
  hashedPassword: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}

  async saveUsers(usersData: UsersDto, lang: string = 'en') {
    const signupRateKey = `ratelimit:signup:${usersData.email}`;
    const attempts = await this.redisService.incr(signupRateKey, 3600);
    if(attempts > 5){
      throw new HttpException('Too many requests. Please wait before trying again', 429);
    }

    const existingEmail = await this.usersService.findUserByEmail(usersData.email);
    if (existingEmail) throw new ConflictException('Email already taken');

    const existingUsername = await this.usersService.findUser(usersData.username);
    if (existingUsername) throw new ConflictException('Username already taken');

    const hashedPassword = await bcrypt.hash(usersData.password, 10);

    const token = await this.jwtService.signAsync(
      { email: usersData.email, type: 'email-verify' },
      { expiresIn: '15m' },
    );

    const pending: PendingSignup = {
      username: usersData.username,
      email: usersData.email,
      hashedPassword,
    };
    await this.redisService.set(`pending:${token}`, JSON.stringify(pending), 900);

    const link = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
    this.emailService.sendVerificationEmail(usersData.email, link, lang)
      .catch((err) => console.error('Failed to send verification email:', err));

    return { message: 'Account created! Please check your email to verify your account.' };
  }

  async login(loginData: LoginDto) {
    const loginKey = `ratelimit:login:${loginData.username}`;
    const attempts = await this.redisService.get(loginKey);
    if(attempts && Number(attempts) >= 5){
      throw new HttpException('Too many requests. Please wait before trying again', 429);
    }

    const user = await this.usersService.findUser(loginData.username);

    if (!user) {
      await this.redisService.incr(loginKey, 900);
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      await this.redisService.incr(loginKey, 900);
      throw new UnauthorizedException('Invalid Credentials');
    }
    await this.redisService.del(loginKey);

    const payload = { sub: user.userId, username: user.username };
    return {
      message: 'Login Successful !!!. Redirecting Now',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyEmail(token: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired verification link');
    }

    if (payload.type !== 'email-verify') {
      throw new UnauthorizedException('Invalid token type');
    }

    const pendingJson = await this.redisService.get(`pending:${token}`);
    if (!pendingJson) {
      throw new UnauthorizedException('Verification link already used or expired');
    }

    const pending: PendingSignup = JSON.parse(pendingJson);

    const existingEmail = await this.usersService.findUserByEmail(pending.email);
    if (existingEmail) throw new ConflictException('Email already taken');

    const existingUsername = await this.usersService.findUser(pending.username);
    if (existingUsername) throw new ConflictException('Username already taken');
    await this.redisService.del(`pending:${token}`);
    await this.usersService.createVerifiedUser(pending);

    return { message: 'Email verified successfully! You can now log in.' };
  }

  async forgotPass(data: ForgotPasswordDto, lang: string = 'en'){
    const forgotRateKey = `ratelimit:forgot:${data.email}`;
    const attempts = await this.redisService.incr(forgotRateKey, 900);
    if(attempts > 3){
      throw new HttpException('Too many requests. Please wait before trying again', 429);
    }

    const userEmail = await this.usersService.findUserByEmail(data.email);
    if(!userEmail) return { message: "Password Reset email sent! Please check your email" };

    const token = await this.jwtService.signAsync(
      { email: userEmail.email, type: 'reset-pass' },
      { expiresIn: '15m' }
    );

    await this.redisService.set(`reset:${token}`, String(userEmail.userId), 900);
    const link = `${process.env.FRONTEND_URL}/auth/reset-pass?token=${token}`;

    this.emailService.sendForgotPass(data.email, link, lang)
      .catch((err) => console.log('Error sending email ', err));
    
      return { message: 'Password Reset email sent! Please check your email' };
  }

  async resetPass(body: ResetPasswordDto) {
    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(body.token);
    } catch {
      throw new UnauthorizedException('Invalid or expired reset link');
    }

    if(payload.type !== 'reset-pass') throw new UnauthorizedException('Invalid token type');

    const pendingJson = await this.redisService.get(`reset:${body.token}`);
    if(!pendingJson) throw new UnauthorizedException('Reset link already used or expired');

    const userId = pendingJson;

    await this.redisService.del(`reset:${body.token}`);
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);

    return await this.usersService.userChangePassword(userId, hashedPassword);
  }
}
