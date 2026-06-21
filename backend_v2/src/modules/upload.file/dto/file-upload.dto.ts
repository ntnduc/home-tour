import {
  IsOptional,
  IsString,
  Length
} from 'class-validator';
import { UploadCategory } from 'src/common/enums/upload.enum';

export class FileUploadDto {
  @IsString()
  @Length(0, 255)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(0, 50)
  category: UploadCategory;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  @IsString()
  @IsOptional()
  relatedEntityId: string;

  @IsString()
  @IsOptional()
  isPublic?: string;

  @IsString()
  @IsOptional()
  originalName?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsString()
  @IsOptional()
  collectionId?: string;

}
