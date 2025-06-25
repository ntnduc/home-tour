import { BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { DataSource, Repository } from 'typeorm';
import { TestCreateDto } from './dto/test.create.dto';
import { TestDetailDto } from './dto/test.detail.dto';
import { TestListDto } from './dto/test.list.dto';
import { TestUpdateDto } from './dto/test.update.dto';
import { TestChild } from './entities/test-child.entity';
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
    private readonly dataSource: DataSource,
  ) {
    super(
      testRepository,
      TestDetailDto,
      TestListDto,
      TestCreateDto,
      TestUpdateDto,
    );
  }

  async create(dto: TestCreateDto): Promise<TestDetailDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const test = this.testRepository.create(dto);
      const child = [
        {
          name: 'test child 1',
        },
        {
          name: 'test child 2',
        },
      ] as TestChild[];
      test.children = child;

      await queryRunner.manager.save(test);

      await queryRunner.commitTransaction();
      const result = new TestDetailDto();
      result.fromEntity(test);
      return result;
    } catch (error) {
      throw new BadGatewayException('Lỗi test');
    } finally {
      await queryRunner.release();
    }
  }
}
