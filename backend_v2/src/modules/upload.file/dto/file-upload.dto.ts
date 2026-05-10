import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class FileUploadDto {
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

  @IsString()
  @IsOptional()
  originalName?: string;
}
