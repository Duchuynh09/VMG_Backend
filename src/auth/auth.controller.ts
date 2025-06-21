import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from './roles/roles.guard';
import { UsersService } from 'src/users/users.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body);
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
}
