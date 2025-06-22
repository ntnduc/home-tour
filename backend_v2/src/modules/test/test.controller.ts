import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/crud/base.controller';
import { TestCreateDto } from './dto/test.create.dto';
import { TestDetailDto } from './dto/test.detail.dto';
import { Test } from './entities/test.entity';
import { TestService } from './test.service';

@ApiTags('test')
@Controller('api/test')
export class TestController extends BaseController<
  TestService,
  Test,
  TestDetailDto,
  TestCreateDto
> {
  constructor(private readonly testService: TestService) {
    super(testService, TestCreateDto);
  }
}
