import { BaseDetailDto } from '../../../common/base/dto/detail.dto';
import { FileEntry } from '../entities/file-entry.entity';

export class FileEntryDetailDto extends BaseDetailDto<FileEntry> {
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  extension: string;
  filePath: string;
  order?: number;
  metadata?: Record<string, any>;
  collectionId: string;
  isDeleted: boolean;
  deletedAt?: Date;
  url?: string; // Generated URL

  fromEntity(entity: FileEntry): void {
    this.id = entity.id;
    this.originalName = entity.originalName;
    this.fileName = entity.fileName;
    this.mimeType = entity.mimeType;
    this.fileSize = entity.fileSize;
    this.extension = entity.extension;
    this.filePath = entity.filePath;
    this.order = entity.order;
    this.metadata = entity.metadata;
    this.collectionId = entity.collectionId;
    this.isDeleted = entity.isDeleted;
    this.deletedAt = entity.deletedAt;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;
  }
}
