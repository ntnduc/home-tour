import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';

export class ReponseOtpVerify {
  @IsBoolean()
  isRegistered: boolean;

  @IsString()
  @IsOptional()
  tempToken?: string;

  @IsString()
  @IsOptional()
  registrationToken?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsOptional()
  user?: User;
}

export class RequestRegister {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class RequestRefreshToken {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
