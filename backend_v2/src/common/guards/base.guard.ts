import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANONYMOUS_KEY } from '../decorators/allow-anonymous.decorator';

export abstract class BaseGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public - bypass all checks
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      ALLOW_ANONYMOUS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) return true;

    // Delegate to specific guard implementation
    return this.canActivateGuard(context);
  }

  // Abstract method that each guard must implement
  protected abstract canActivateGuard(
    context: ExecutionContext,
  ): Promise<boolean>;
}
