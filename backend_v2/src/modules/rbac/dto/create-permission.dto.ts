import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Permission name', example: 'CREATE_INVOICE' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  permissionName: string;

  @ApiProperty({ description: 'Permission description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
