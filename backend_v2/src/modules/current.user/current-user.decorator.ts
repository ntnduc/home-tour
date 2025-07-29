import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserPayload } from './current.user.service';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
