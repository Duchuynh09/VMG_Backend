import { Body, Controller, Delete, Get, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from './roles/roles.guard';
import { UsersService } from 'src/worker/woker.service';
import { access } from 'fs';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const token = await this.authService.login(req.user);
    res.cookie('access_token', token.access_token, {
      httpOnly: true,     // 🔒 Không cho JS truy cập
      secure: false,      // Bật true nếu dùng HTTPS
      sameSite: 'lax',    // hoặc 'strict', 'none'
      maxAge: 1000 * 60 * 60 * 24, // 1 ngày
    });
    return { mess: "Login thanh cong", access_token: token.access_token }
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.HR)
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
