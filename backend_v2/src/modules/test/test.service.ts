import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { Repository } from 'typeorm';
import { TestCreateDto } from './dto/test.create.dto';
import { TestDetailDto } from './dto/test.detail.dto';
import { TestListDto } from './dto/test.list.dto';
import { TestUpdateDto } from './dto/test.update.dto';
import { Test } from './entities/test.entity';

export class TestService extends BaseService<
  Test,
  TestDetailDto,
  TestListDto,
  TestCreateDto,
  TestUpdateDto
> {
  constructor(
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
  ) {
    super(
      testRepository,
      TestDetailDto,
      TestListDto,
      TestCreateDto,
      TestUpdateDto,
    );
  }
}
