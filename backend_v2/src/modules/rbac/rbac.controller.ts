import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission, Role } from 'src/common/enums/role.enum';
import { StickAuthGaurd } from '../auth/jwt-auth.guard';
import { RequirePermissions } from './decorators/permissions.decorator';
import { Roles } from './decorators/roles.decorator';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UserPermissionsDto, UserRoleDto } from './dto/user-permissions.dto';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { RbacService } from './rbac.service';

@ApiTags('RBAC Management')
@ApiBearerAuth()
@Controller('api/rbac')
@UseGuards(StickAuthGaurd, RolesGuard, PermissionsGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  // Role Management
  @Post('roles')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @Roles(Role.ADMIN)
  @RequirePermissions(Permission.CREATE_USER)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rbacService.createRole(
      createRoleDto.roleName,
      createRoleDto.description,
    );
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of all roles' })
  @Roles(Role.ADMIN, Role.OWNER)
  async getAllRoles() {
    return this.rbacService.getAllRoles();
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get role by ID with permissions' })
  @ApiResponse({ status: 200, description: 'Role details with permissions' })
  @Roles(Role.ADMIN, Role.OWNER)
  async getRoleById(@Param('id') id: string) {
    return this.rbacService.getRoleById(id);
  }

  // Permission Management
  @Post('permissions')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @Roles(Role.ADMIN)
  @RequirePermissions(Permission.MANAGE_SYSTEM)
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.rbacService.createPermission(
      createPermissionDto.permissionName,
      createPermissionDto.description,
    );
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'List of all permissions' })
  @Roles(Role.ADMIN, Role.OWNER)
  async getAllPermissions() {
    return this.rbacService.getAllPermissions();
  }

  // Role-Permission Assignment
  @Post('roles/assign-permission')
  @ApiOperation({ summary: 'Assign permission to role' })
  @ApiResponse({
    status: 200,
    description: 'Permission assigned to role successfully',
  })
  @Roles(Role.ADMIN)
  @RequirePermissions(Permission.ASSIGN_ROLE)
  async assignPermissionToRole(
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    await this.rbacService.assignPermissionToRole(
      assignPermissionDto.roleId,
      assignPermissionDto.permissionId,
    );
    return { message: 'Permission assigned to role successfully' };
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @ApiOperation({ summary: 'Remove permission from role' })
  @ApiResponse({
    status: 200,
    description: 'Permission removed from role successfully',
  })
  @Roles(Role.ADMIN)
  @RequirePermissions(Permission.ASSIGN_ROLE)
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    await this.rbacService.removePermissionFromRole(roleId, permissionId);
    return { message: 'Permission removed from role successfully' };
  }

  // User-Role Assignment
  @Post('users/assign-role')
  @ApiOperation({ summary: 'Assign role to user for a property' })
  @ApiResponse({
    status: 200,
    description: 'Role assigned to user successfully',
  })
  @Roles(Role.ADMIN, Role.OWNER)
  @RequirePermissions(Permission.ASSIGN_ROLE)
  async assignUserRole(@Body() assignRoleDto: AssignRoleDto) {
    const userRole = await this.rbacService.assignUserRole(
      assignRoleDto.userId,
      assignRoleDto.roleId,
      assignRoleDto.propertyId,
    );
    return {
      message: 'Role assigned to user successfully',
      userRole,
    };
  }

  @Delete('users/:userId/roles/:roleId/properties/:propertyId')
  @ApiOperation({ summary: 'Remove role from user for a property' })
  @ApiResponse({
    status: 200,
    description: 'Role removed from user successfully',
  })
  @Roles(Role.ADMIN, Role.OWNER)
  @RequirePermissions(Permission.ASSIGN_ROLE)
  async removeUserRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @Param('propertyId') propertyId: string,
  ) {
    await this.rbacService.removeUserRole(userId, roleId, propertyId);
    return { message: 'Role removed from user successfully' };
  }

  // User Permissions and Roles Query
  @Get('users/:userId/roles')
  @ApiOperation({ summary: 'Get all roles for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of user roles',
    type: [UserRoleDto],
  })
  @Roles(Role.ADMIN, Role.OWNER)
  async getUserRoles(@Param('userId') userId: string) {
    const userRoles = await this.rbacService.getUserRoles(userId);
    return userRoles.map((ur) => ({
      userId: ur.userId,
      roleId: ur.roleId,
      roleName: ur.role.roleName,
      propertyId: ur.propertyId,
      propertyName: ur.property?.name || 'Unknown Property',
      assignedDate: ur.assignedDate,
    }));
  }

  @Get('users/:userId/permissions')
  @ApiOperation({ summary: 'Get all permissions for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of user permissions',
    type: UserPermissionsDto,
  })
  async getUserPermissions(
    @Param('userId') userId: string,
    @Query('propertyId') propertyId?: string,
  ) {
    const permissions = await this.rbacService.getUserPermissions(
      userId,
      propertyId,
    );
    return {
      userId,
      propertyId,
      permissions,
    };
  }

  @Get('users/:userId/properties/:propertyId/access')
  @ApiOperation({ summary: 'Check if user has access to a property' })
  @ApiResponse({ status: 200, description: 'Property access status' })
  async checkPropertyAccess(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    const hasAccess = await this.rbacService.hasPropertyAccess(
      userId,
      propertyId,
    );
    return {
      userId,
      propertyId,
      hasAccess,
    };
  }

  // System Initialization
  @Post('initialize')
  @ApiOperation({ summary: 'Initialize default roles and permissions' })
  @ApiResponse({
    status: 200,
    description: 'Default roles and permissions initialized',
  })
  @Roles(Role.ADMIN)
  @RequirePermissions(Permission.MANAGE_SYSTEM)
  async initializeSystem() {
    await this.rbacService.initializeDefaultRolesAndPermissions();
    return {
      message: 'Default roles and permissions initialized successfully',
    };
  }
}
