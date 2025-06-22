import { BaseDetailDto } from 'src/common/base/dto/detail.dto';
import { Test } from '../entities/test.entity';

export class TestDetailDto extends BaseDetailDto<Test> {
  name: string;

  fromEntity(entity: Test): void {
    this.id = entity.id;
    this.name = entity.name;
  }
}
