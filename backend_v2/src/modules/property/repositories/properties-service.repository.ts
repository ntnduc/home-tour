import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { PropertiesService } from '../entities/properties-service.entity';

@Injectable()
export class PropertiesServiceRepository extends BaseRepository<PropertiesService> {
  constructor(dataSource: DataSource) {
    super(PropertiesService, dataSource);
  }
}
