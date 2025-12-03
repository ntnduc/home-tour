import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { TestContentCreateDto } from './test-content.create.dto';

export class TestMappingCreateDto {
  @IsString()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => TestContentCreateDto)
  testContent?: TestContentCreateDto[];
}
