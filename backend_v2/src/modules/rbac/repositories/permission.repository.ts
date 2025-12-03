import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base/repositories/base.repository';
import { DataSource, Repository } from 'typeorm';
import { PermissionEntity } from '../entities/permission.entity';

@Injectable()
export class PermissionRepository extends BaseRepository<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    dataSource: DataSource,
  ) {
    super(PermissionEntity, dataSource);
  }

  async findByName(permissionName: string): Promise<PermissionEntity | null> {
    return this.permissionRepository.findOne({
      where: { permissionName },
    });
  }

  async findByNames(permissionNames: string[]): Promise<PermissionEntity[]> {
    return this.permissionRepository.find({
      where: permissionNames.map((name) => ({ permissionName: name })),
    });
  }
}
