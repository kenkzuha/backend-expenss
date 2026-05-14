import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './auth.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService){}

  saveUsers(usersData: UsersDto){
    if(usersData.password)

    return this.usersService.saveUsers(usersData);
  }

  async login(loginData: LoginDto){
    const user = await this.usersService.findUser(loginData.username);

    if(!user){
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);

    if(!isMatch){
      throw new UnauthorizedException('Invalid Credentials');
    }

    const { password, ...result } = user;

    const payload = { sub: user.userId, username: user.username };

    return {
      message: "Login Successful",
      user: result,
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
