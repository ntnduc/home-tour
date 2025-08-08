import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name', example: 'Property Manager' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  roleName: string;

  @ApiProperty({ description: 'Role description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
