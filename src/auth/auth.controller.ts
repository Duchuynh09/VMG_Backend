import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login() {
    return this.authService.login(@Body() loginData: LoginDto);
  }
  @Post('register')
  async register() {
    return this.authService.register();
  }
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }
  @Post('refresh')
  async refresh() {
    return this.authService.refresh();
  }
}
