import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/BaseRepository';
import { Services } from '../entities/services.entity';

@Injectable()
export class ServicesRepository extends BaseRepository<Services> {
  constructor(dataSource: DataSource) {
    super(Services, dataSource);
  }
}
