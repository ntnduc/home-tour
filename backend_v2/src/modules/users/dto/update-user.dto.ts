import { IsBoolean, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsBoolean()
  isPhoneVerified: boolean;

  @IsString()
  fullName: string;
}
// OmitType(CreateUserDto, ['password'] as const),
