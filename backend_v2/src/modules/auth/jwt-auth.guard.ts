import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { BaseGuard } from 'src/common/guards/base.guard';

export class StickAuthGaurd extends BaseGuard {
  constructor(
    private readonly jwtService: JwtService,
    reflector: Reflector,
  ) {
    super(reflector);
  }

  protected async canActivateGuard(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'];

    const hasAuth = !!authHeader;
    if (!hasAuth)
      throw new UnauthorizedException('Authorization token không hợp lệ');

    try {
      const token = authHeader.replace('Bearer ', '');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Map payload to match expected user format
      const user = {
        userId: payload.sub,
        phoneNumber: payload.phoneNumber,
        properties: payload.properties || [],
        iat: payload.iat,
        exp: payload.exp,
      };

      (request as any).token = token;
      (request as any).user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException('Authorization token không hợp lệ');
    }
  }
}
