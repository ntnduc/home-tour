import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base/repositories/BaseRepository';
import { DataSource } from 'typeorm';
import { TestMapping } from '../entities/test-mapping.entity';

@Injectable()
export class TestMappingRepository extends BaseRepository<TestMapping> {
  constructor(dataSource: DataSource) {
    super(TestMapping, dataSource);
  }
}
