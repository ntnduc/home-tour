import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../../../common/enums/role.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // Get user permissions from JWT token
    const userProperties = user.properties || [];
    const userPermissions: string[] = [];

    userProperties.forEach((property: any) => {
      if (property.permissions) {
        userPermissions.push(...property.permissions);
      }
    });

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
