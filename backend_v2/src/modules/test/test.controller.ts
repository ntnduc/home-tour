import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/crud/base.controller';
import { TestCreateDto } from './dto/test.create.dto';
import { TestDetailDto } from './dto/test.detail.dto';
import { TestListDto } from './dto/test.list.dto';
import { TestUpdateDto } from './dto/test.update.dto';
import { Test } from './entities/test.entity';
import { TestService } from './test.service';

@ApiTags('test')
@Controller('api/test')
export class TestController extends BaseController<
  TestService,
  Test,
  TestDetailDto,
  TestListDto,
  TestCreateDto,
  TestUpdateDto
> {
  constructor(private readonly testService: TestService) {
    super(
      testService,
      TestDetailDto,
      TestListDto,
      TestCreateDto,
      TestUpdateDto,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Entity already exists.' })
  async create(@Request() request: Request, @Body() dto: TestCreateDto) {
    console.log('💞💓💗💞💓💗 ~ create ~ dto:', dto);
    return await super.create(request, dto);
  }
}
