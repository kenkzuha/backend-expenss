import { Body, Controller, Post } from '@nestjs/common';
import { UsersDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('signup')
  async saveUsers(@Body() usersData: UsersDto){
    return await this.authService.saveUsers(usersData);
  }

  @Post('login')
  login(@Body() loginData: LoginDto){
    return this.authService.login(loginData);
  }
}
