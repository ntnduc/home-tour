import { ApiProperty } from '@nestjs/swagger';
import { Permission } from 'src/common/enums/role.enum';

export class UserPermissionsDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Property ID', required: false })
  propertyId?: string;

  @ApiProperty({ description: 'List of user permissions', type: [String] })
  permissions: Permission[];
}

export class UserRoleDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Role ID' })
  roleId: string;

  @ApiProperty({ description: 'Role name' })
  roleName: string;

  @ApiProperty({ description: 'Property ID' })
  propertyId: string;

  @ApiProperty({ description: 'Property name' })
  propertyName: string;

  @ApiProperty({ description: 'Assigned date' })
  assignedDate: Date;
}
