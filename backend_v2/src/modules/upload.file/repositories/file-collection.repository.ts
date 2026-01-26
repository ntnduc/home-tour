import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { FileCollection } from '../entities/file-collection.entity';

@Injectable()
export class FileCollectionRepository extends BaseRepository<FileCollection> {
  constructor(dataSource: DataSource) {
    super(FileCollection, dataSource);
  }
}
