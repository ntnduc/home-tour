import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base/repositories/BaseRepository';
import { DataSource } from 'typeorm';
import { TestChild } from '../entities/test-child.entity';

@Injectable()
export class TestChildRepository extends BaseRepository<TestChild> {
  constructor(dataSource: DataSource) {
    super(TestChild, dataSource);
  }
}
