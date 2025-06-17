import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtTempStrategy extends PassportStrategy(Strategy, 'jwt-temp') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('temp-token'),
      secretOrKey: process.env.JWT_TEMP_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any, request: Request) {
    // payload sẽ chứa thông tin số điện thoại từ token tạm
    return { phone: payload.phoneNumber };
  }
}
