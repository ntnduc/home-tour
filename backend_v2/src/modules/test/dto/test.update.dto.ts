import { BaseUpdateDto } from 'src/common/base/dto/update.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Test } from '../entities/test.entity';

export class TestUpdateDto extends BaseUpdateDto<Test> {
  name: string;

  getEntity(entity: Test): QueryDeepPartialEntity<Test> {
    entity.name = this.name;
    return entity;
  }
}
