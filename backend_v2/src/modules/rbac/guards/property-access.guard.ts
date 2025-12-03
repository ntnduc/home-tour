import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseGuard } from '../../../common/guards/base.guard';
import { PROPERTY_ACCESS_KEY } from '../decorators/property-access.decorator';

@Injectable()
export class PropertyAccessGuard extends BaseGuard {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  protected async canActivateGuard(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requirePropertyAccess = this.reflector.getAllAndOverride<boolean>(
      PROPERTY_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requirePropertyAccess) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      return false;
    }

    // Extract propertyId from request params, query, or body
    const propertyId =
      request.params?.id || // For GET /property/:id, PUT /property/:id, DELETE /property/:id
      request.params?.propertyId ||
      request.query?.propertyId ||
      request.body?.propertyId ||
      request.body?.id; // For update operations where id might be in body

    if (!propertyId) {
      throw new ForbiddenException(
        'Property ID is required for this operation',
      );
    }

    // Check if user has access to this specific property from JWT token
    const userProperties = user.properties || [];

    // Admin has access to all properties
    const isAdmin = userProperties.some(
      (property: any) => property.role === 'Admin',
    );

    if (isAdmin) {
      return true;
    }

    // Check if user has access to this specific property
    const hasAccess = userProperties.some(
      (property: any) => property.propertyId === propertyId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this property');
    }

    return true;
  }
}
