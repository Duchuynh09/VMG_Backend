
import { Injectable } from '@nestjs/common';
import { User } from "./schemas/user.schema";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authModel: Model<User>,
    private jwtService: JwtService
  ) { }
  //Kiểm tra tài khoản và mật khẩu
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.authModel.findOne({username});
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
    return "Tạo tài khoản và thông tin cho công nhân"
    // return this.usersService.createEmployee(payload)
  }
  async getAll(){
    const users = await this.authModel.find().exec()
    return users
  }
}
