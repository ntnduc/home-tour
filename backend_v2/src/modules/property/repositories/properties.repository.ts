import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/BaseRepository';
import { Properties } from '../entities/properties.entity';

@Injectable()
export class PropertiesRepository extends BaseRepository<Properties> {
  constructor(dataSource: DataSource) {
    super(Properties, dataSource);
  }
}
