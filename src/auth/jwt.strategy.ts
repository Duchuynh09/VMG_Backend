
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          const token = req.cookies?.['access_token'];
          return token || null
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessSecret,
    });
  }
  async validate(payload: any) {
    // Kiểm tra
    console.log('auth/jwt.strategy.ts > validate', payload);

    return payload;
  }
}
