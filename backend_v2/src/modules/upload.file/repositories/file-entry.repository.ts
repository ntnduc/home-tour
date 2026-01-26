import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { FileEntry } from '../entities/file-entry.entity';

@Injectable()
export class FileEntryRepository extends BaseRepository<FileEntry> {
  constructor(dataSource: DataSource) {
    super(FileEntry, dataSource);
  }
}
