import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ALLOW_ANONYMOUS_KEY } from 'src/common/decorators/allow-anonymous.decorator';

export class StickAuthGaurd implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      ALLOW_ANONYMOUS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

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
      (request as any).token = token;
      (request as any).user = payload;

      return true;
    } catch (e) {
      throw new UnauthorizedException('Authorization token không hợp lệ');
    }
  }
}
