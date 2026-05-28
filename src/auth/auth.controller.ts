import { Body, Controller, Get, Headers, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersDto } from 'src/users/users.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async saveUsers(
    @Body() usersData: UsersDto,
    @Headers('accept-language') lang: string,
  ) {
    return this.authService.saveUsers(usersData, lang || 'en');
  }

  @Post('login')
  async login(@Body() loginData: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginData);

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { message: result.message };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return req['user'];
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
