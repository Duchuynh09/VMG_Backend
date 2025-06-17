import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register() {
    // return this.authService.register();
  }
  @Post('logout')
  async logout(@Request() req) {
    // return this.authService.logout();
    return req.user;
  }
  @Post('refresh')
  async refresh() {
    // return this.authService.refresh();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
  // Trả về yêu cầu chưa trả về res
    return req.user;
  }

}
