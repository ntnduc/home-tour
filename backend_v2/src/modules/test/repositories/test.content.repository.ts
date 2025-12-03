import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base/repositories/base.repository';
import { DataSource } from 'typeorm';
import { TestContent } from '../entities/test-content.entity';

@Injectable()
export class TestContentRepository extends BaseRepository<TestContent> {
  constructor(dataSource: DataSource) {
    super(TestContent, dataSource);
  }
}
