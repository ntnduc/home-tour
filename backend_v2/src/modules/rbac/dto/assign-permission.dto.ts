import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignPermissionDto {
  @ApiProperty({ description: 'Role ID' })
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({ description: 'Permission ID' })
  @IsString()
  @IsNotEmpty()
  permissionId: string;
}
