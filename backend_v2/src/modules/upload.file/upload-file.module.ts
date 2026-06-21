import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from '../property/entities/rooms.entity';
import uploadFileConfig from './config/upload-file.config';
import { FileCollection } from './entities/file-collection.entity';
import { FileEntry } from './entities/file-entry.entity';
import { FileCollectionRepository } from './repositories/file-collection.repository';
import { FileEntryRepository } from './repositories/file-entry.repository';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';

@Module({
  imports: [
    ConfigModule.forFeature(uploadFileConfig),
    TypeOrmModule.forFeature([FileCollection, FileEntry, Rooms]),
  ],
  controllers: [UploadFileController],
  providers: [
    UploadFileService,
    FileCollectionRepository,
    FileEntryRepository,
  ],
  exports: [UploadFileService, FileCollectionRepository, FileEntryRepository],
})
export class UploadFileModule { }
