import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BaseUpdateDto } from '../../../common/base/dto/update.dto';
import { FileCollection } from '../entities/file-collection.entity';

export class FileCollectionUpdateDto extends BaseUpdateDto<FileCollection> {
  @IsString()
  @Length(0, 255)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(0, 50)
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  @IsString()
  @IsOptional()
  relatedEntityId?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  getEntity(entity: FileCollection): FileCollection {
    if (this.name !== undefined) entity.name = this.name;
    if (this.category !== undefined) entity.category = this.category;
    if (this.description !== undefined) entity.description = this.description;
    if (this.relatedEntityType !== undefined)
      entity.relatedEntityType = this.relatedEntityType;
    if (this.relatedEntityId !== undefined)
      entity.relatedEntityId = this.relatedEntityId;
    if (this.isPublic !== undefined) entity.isPublic = this.isPublic;
    return entity;
  }
}
