import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtTempStrategy extends PassportStrategy(Strategy, 'jwt-temp') {
  constructor() {
    super({
      _jwtFromRequest: ExtractJwt.fromHeader('temp-token'),
      get jwtFromRequest() {
        return this._jwtFromRequest;
      },
      set jwtFromRequest(value) {
        this._jwtFromRequest = value;
      },
      secretOrKey: process.env.JWT_TEMP_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any, request: Request) {
    // payload sẽ chứa thông tin số điện thoại từ token tạm
    return { phone: payload.phoneNumber };
  }
}
