import { BaseDetailDto } from '../../../common/base/dto/detail.dto';
import { FileCollection } from '../entities/file-collection.entity';
import { FileEntryDetailDto } from './file-entry.detail.dto';

export class FileCollectionDetailDto extends BaseDetailDto<FileCollection> {
  name?: string;
  category?: string;
  description?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isPublic: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  metadata?: Record<string, any>;
  files?: FileEntryDetailDto[];

  fromEntity(entity: FileCollection): void {
    this.id = entity.id;
    this.name = entity.name;
    this.category = entity.category;
    this.description = entity.description;
    this.relatedEntityType = entity.relatedEntityType;
    this.relatedEntityId = entity.relatedEntityId;
    this.isPublic = entity.isPublic;
    this.isDeleted = entity.isDeleted;
    this.deletedAt = entity.deletedAt;
    this.metadata = entity.metadata;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;

    // Map files if exists
    if (entity.files && entity.files.length > 0) {
      this.files = entity.files
        .filter((f) => !f.isDeleted)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((file) => {
          const fileDto = new FileEntryDetailDto();
          fileDto.fromEntity(file);
          return fileDto;
        });
    }
  }
}
