import { IsString } from 'class-validator';
import { BaseListDto } from '../../../common/base/dto/list.dto';
import { FileCollection } from '../entities/file-collection.entity';

export class FileCollectionListDto extends BaseListDto<FileCollection> {
  @IsString()
  name?: string;

  @IsString()
  category?: string;

  fromEntity(entity: FileCollection): void {
    this.id = entity.id;
    this.name = entity.name;
    this.category = entity.category;
  }
}
