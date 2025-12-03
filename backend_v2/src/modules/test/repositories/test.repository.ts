import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base/repositories/base.repository';
import { DataSource } from 'typeorm';
import { Test } from '../entities/test.entity';

@Injectable()
export class TestRepository extends BaseRepository<Test> {
  constructor(dataSource: DataSource) {
    super(Test, dataSource);
  }
}
