import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base/repositories/BaseRepository';
import { DataSource } from 'typeorm';
import { Test } from '../entities/test.entity';

@Injectable()
export class TestRepository extends BaseRepository<Test> {
  constructor(dataSource: DataSource) {
    super(Test, dataSource);
  }
}
