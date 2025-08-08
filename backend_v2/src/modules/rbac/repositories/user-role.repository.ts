import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class UserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async findByUserId(userId: string): Promise<UserRole[]> {
    return this.userRoleRepository.find({
      where: { userId },
      relations: [
        'role',
        'property',
        'role.rolePermissions',
        'role.rolePermissions.permission',
      ],
    });
  }

  async findByUserIdAndPropertyId(
    userId: string,
    propertyId: string,
  ): Promise<UserRole[]> {
    return this.userRoleRepository.find({
      where: { userId, propertyId },
      relations: [
        'role',
        'property',
        'role.rolePermissions',
        'role.rolePermissions.permission',
      ],
    });
  }

  async hasPropertyAccess(
    userId: string,
    propertyId: string,
  ): Promise<boolean> {
    const userRole = await this.userRoleRepository.findOne({
      where: { userId, propertyId },
    });
    return !!userRole;
  }

  async assignRole(
    userId: string,
    roleId: string,
    propertyId: string,
  ): Promise<UserRole> {
    const userRole = this.userRoleRepository.create({
      userId,
      roleId,
      propertyId,
      assignedDate: new Date(),
    });
    return this.userRoleRepository.save(userRole);
  }

  async removeRole(
    userId: string,
    roleId: string,
    propertyId: string,
  ): Promise<void> {
    await this.userRoleRepository.delete({
      userId,
      roleId,
      propertyId,
    });
  }

  async getUserPropertiesWithRoles(userId: string): Promise<UserRole[]> {
    return this.userRoleRepository.find({
      where: { userId },
      relations: ['role', 'property'],
    });
  }
}
