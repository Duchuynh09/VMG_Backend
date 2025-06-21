
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }
  //Kiểm tra tài khoản và mật khẩu
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      const compliPass = await bcrypt.compare(pass, user.password)
      if (compliPass) {
        const { password: _, ...safeUser } = user.toObject(); // Remove hashed password
        return safeUser;
      }
    }
    return null;
  }
  async login(user: any) {
    // @UseGuards sẽ kiểm tra trước khi chạy login
    const payload = { temmId: user.teamId, sub: user._id, roles: [user.role] };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
  async register(payload: any) {
    return this.usersService.createEmployee(payload)
  }
}
