import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/repositories/base.repository';
import { DataSource, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    dataSource: DataSource,
  ) {
    super(RoleEntity, dataSource);
  }

  async findByName(roleName: string): Promise<RoleEntity | null> {
    return this.roleRepository.findOne({
      where: { roleName },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
  }

  async findWithPermissions(id: string): Promise<RoleEntity | null> {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
  }
}
