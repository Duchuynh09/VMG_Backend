
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from "./schemas/user.schema";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { jwtConstants } from './constants';
import { filterOutMatchingToken, findMatchingTokenIndex } from './utils/token-matcher.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authModel: Model<User>,
    private jwtService: JwtService
  ) { }
  async #createToken(user:User){
    const payload = { temmId: user.profile, sub: user._id, roles: [user.role] };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.accessSecret,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d',
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return {
      accessToken,hashedRefreshToken,refreshToken
    }
  }
  //Kiểm tra tài khoản và mật khẩu
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.authModel.findOne({ username });
    if (user) {
      const compliPass = await bcrypt.compare(pass, user.password)
      if (compliPass) {
        return user;
      }
    }
    return null;
  }
  async login(user: User, userAgent: string, ip: string) {
    // @UseGuards sẽ kiểm tra trước khi chạy login
    // user.profile = id của thông tin người dùng
    const tokens = await this.#createToken(user)
        // ✅ Loại bỏ token cũ từ cùng thiết bị
    const cleanedTokens = user.refreshTokens.filter(
      (entry) => entry.userAgent !== userAgent || entry.ip !== ip,
    );
    cleanedTokens.push({
      tokenHash: tokens.hashedRefreshToken,
      userAgent,
      ip,
    });
    // 🧠 Ghi lại toàn bộ mảng
    user.refreshTokens = cleanedTokens;
    await user.save();
    return tokens
  }
  async refreshToken(rawToken: string, userAgent: string, ip: string) {
    // token là refresh-token lấy từ cookie 
    if (!rawToken) throw new UnauthorizedException('Không có refresh token');

    try {
      const payload = this.jwtService.verify(rawToken, {
        secret: jwtConstants.refreshSecret,
      });
      // payload.sub = user._id
      const user = await this.authModel.findById(payload.sub);
      // so sánh cookie với trong db
      if (!user) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }
      // So sánh token plaintext với hashed token đã lưu
      //findMatchingTokenIndex(token, entries[]) =  tìm index của token khớp
      const matchedIndex = await findMatchingTokenIndex(rawToken, user.refreshTokens);
      if (matchedIndex === undefined || matchedIndex === -1) {
        throw new UnauthorizedException('Token không hợp lệ');
      }
      const tokens = await this.#createToken(user)
      const newAccessToken = tokens.accessToken
      const newRefreshToken = tokens.refreshToken
      // 🔒 Hash và lưu token mới
      // xoá cái cũ ngay vị trí tìm được token khớp trong db ở trên
      user.refreshTokens.splice(matchedIndex, 1);
      user.refreshTokens.push({
        tokenHash: tokens.hashedRefreshToken, userAgent, ip
      })
      await user.save();
      return {
        newAccessToken,
        newRefreshToken
      }
    } catch (err) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }
  async logout(token: string, userId: string, all = false) {
    const user = await this.authModel.findById(userId);
    if (!user) return;

    if (all) {
      user.refreshTokens = [];
    } else {
      user.refreshTokens = await filterOutMatchingToken(token, user.refreshTokens);
    }

    await user.save();
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
  async register(payload: any) {
    return "Tạo tài khoản và thông tin cho công nhân"
    // return this.usersService.createEmployee(payload)
  }
  async getAll() {
    const users = await this.authModel.find().exec()
    return users
  }

}

