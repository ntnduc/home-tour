import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionTreeService } from '../../common/services/permission-tree.service';
import { PermissionEntity } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { RoleEntity } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { PermissionsGuard } from './guards/permissions.guard';
import { PropertyAccessGuard } from './guards/property-access.guard';
import { RolesGuard } from './guards/roles.guard';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { PermissionRepository } from './repositories/permission.repository';
import { RoleRepository } from './repositories/role.repository';
import { UserRoleRepository } from './repositories/user-role.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      RolePermission,
      UserRole,
    ]),
  ],
  controllers: [RbacController],
  providers: [
    RbacService,
    RoleRepository,
    PermissionRepository,
    UserRoleRepository,
    PermissionTreeService,
    RolesGuard,
    PermissionsGuard,
    PropertyAccessGuard,
  ],
  exports: [
    RbacService,
    PermissionTreeService,
    RolesGuard,
    PermissionsGuard,
    PropertyAccessGuard,
  ],
})
export class RbacModule {}
