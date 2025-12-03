import { SetMetadata } from '@nestjs/common';

export const PROPERTY_ACCESS_KEY = 'propertyAccess';
export const RequirePropertyAccess = () =>
  SetMetadata(PROPERTY_ACCESS_KEY, true);
