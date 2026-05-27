import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './auth.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}

  async saveUsers(usersData: UsersDto) {
    await this.usersService.saveUsers(usersData);

    const user = await this.usersService.findUserByEmail(usersData.email);

    const token = await this.jwtService.signAsync(
      { sub: user!.userId, email: user!.email, type: 'email-verify' },
      { expiresIn: '15m' },
    );

    await this.redisService.set(`verify:${token}`, String(user!.userId), 900);

    const link = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;

    this.emailService.sendVerificationEmail(user!.email, link)
      .catch((err) => console.error('Failed to send verification email:', err));

    return {
      message: 'Account created! Please check your email to verify your account.',
    };
  }

  async login(loginData: LoginDto) {
    const user = await this.usersService.findUser(loginData.username);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

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

    const stored = await this.redisService.get(`verify:${token}`);
    if (!stored) {
      throw new UnauthorizedException('Verification link already used or expired');
    }

    await this.redisService.del(`verify:${token}`);
    await this.usersService.markEmailVerified(Number(payload.sub));

    return { message: 'Email verified successfully! You can now log in.' };
  }
}
