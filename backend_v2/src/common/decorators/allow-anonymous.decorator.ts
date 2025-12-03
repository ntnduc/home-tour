import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANONYMOUS_KEY = 'allowAnonymous';
export const AllowAnonymous = () => SetMetadata(ALLOW_ANONYMOUS_KEY, true);

export const ALLOW_TEMP_TOKEN_KEY = 'allowTempToken';
export const AllowTempToken = () => SetMetadata(ALLOW_TEMP_TOKEN_KEY, true);
