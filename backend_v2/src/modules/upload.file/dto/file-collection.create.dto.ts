import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BaseCreateDto } from '../../../common/base/dto/create.dto';
import { FileCollection } from '../entities/file-collection.entity';

export class FileCollectionCreateDto extends BaseCreateDto<FileCollection> {
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

  getEntity(): FileCollection {
    const entity = new FileCollection();
    entity.name = this.name;
    entity.category = this.category;
    entity.description = this.description;
    entity.relatedEntityType = this.relatedEntityType;
    entity.relatedEntityId = this.relatedEntityId;
    entity.isPublic = this.isPublic ?? true;
    return entity;
  }
}
