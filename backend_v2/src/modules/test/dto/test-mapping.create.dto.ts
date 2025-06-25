import { TestContentCreateDto } from './test-content.create.dto';

export class TestMappingCreateDto {
  name: string;
  testContent?: TestContentCreateDto[];
}
