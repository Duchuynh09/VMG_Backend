import { Body, Controller, Delete, Get, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from './roles/roles.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }
  // Đăng nhập khi xác thực người dùng thành công 
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;
    const tokens = await this.authService.login(req.user, userAgent, ip);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 tiếng
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
    });
    return { message: 'Đăng nhập thành công' };
  }
  // Tạo lại token cho người dùng khi hết hạn

  @Post('refresh-token')
  async refresh(@Request() req, @Response({ passthrough: true }) res) {
    const token =
      req.cookies['refresh_token'] ||
      req.headers['authorization']?.replace('Bearer ', '');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;

    const tokens = await this.authService.refreshToken(token, userAgent, ip);

    res.cookie('access_token', tokens.newAccessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    res.cookie('refresh_token', tokens.newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Đã cấp access token mới' };
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.HR)
  @Get('/')
  async get() {
    return this.authService.getAll();
  }
  // Đăng ký cho tài khoản người mới khi là role Admin và HR 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.HR)
  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body);
  }
  // Đăng xuất
  @Post('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    const token =
      req.cookies['refresh_token'] ||
      req.headers['authorization']?.replace('Bearer ', '');
    const payload = this.authService.decodeToken(token);
    await this.authService.logout(token, payload.sub, false);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Đăng xuất thành công' };
  }
  @Post('logout-all')
  async logoutAll(@Request() req, @Response({ passthrough: true }) res) {
    const token =
      req.cookies['refresh_token'] ||
      req.headers['authorization']?.replace('Bearer ', '');

    const payload = this.authService.decodeToken(token);
    await this.authService.logout(token, payload.sub, true);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Đăng xuất khỏi tất cả thiết bị' };
  }

}
