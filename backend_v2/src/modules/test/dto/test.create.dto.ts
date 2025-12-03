import { IsString } from 'class-validator';
import { BaseCreateDto } from 'src/common/base/dto/create.dto';
import { Test } from '../entities/test.entity';

export class TestCreateDto extends BaseCreateDto<Test> {
  @IsString()
  name: string;

  getEntity(): Test {
    const entity = new Test();
    entity.name = this.name;
    return entity;
  }
}
