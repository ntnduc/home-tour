import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string; // userId
  phoneNumber: string;
  properties?: Array<{
    propertyId: string;
    role: string;
    permissions: string[];
  }>;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      phoneNumber: payload.phoneNumber,
      properties: payload.properties || [],
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
