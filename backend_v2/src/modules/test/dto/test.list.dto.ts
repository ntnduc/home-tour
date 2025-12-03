import { BaseListDto } from 'src/common/base/dto/list.dto';
import { Test } from '../entities/test.entity';

export class TestListDto extends BaseListDto<Test> {
  name: string;

  fromEntity(entity: Test): void {
    this.id = entity.id;
    this.name = entity.name;
  }
}
