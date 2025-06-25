import { BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { DataSource, Repository } from 'typeorm';
import { TestMappingCreateDto } from './dto/test-mapping.create.dto';
import { TestCreateDto } from './dto/test.create.dto';
import { TestDetailDto } from './dto/test.detail.dto';
import { TestListDto } from './dto/test.list.dto';
import { TestUpdateDto } from './dto/test.update.dto';
import { TestChild } from './entities/test-child.entity';
import { TestContent } from './entities/test-content.entity';
import { TestMapping } from './entities/test-mapping.entity';
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

  async createMapping(dto: TestMappingCreateDto): Promise<TestDetailDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const testEnity = new Test();
      testEnity.name = dto.name;

      if (dto.testContent && dto.testContent.length > 0) {
        const testMapping = dto.testContent.map((testContent) => {
          const testMapping = new TestMapping();
          if (testContent.id) {
            testMapping.test_content_id = testContent.id;
          } else {
            const testContentEntity = new TestContent();
            testContentEntity.name = testContent.name;
            testMapping.testContent = testContentEntity;
          }

          return testMapping;
        });
        testEnity.testMappings = testMapping;
      }

      await queryRunner.manager.save(testEnity);

      const result = new TestDetailDto();
      return result;
    } catch (error) {
      throw new BadGatewayException('Lỗi test mapping');
    } finally {
      await queryRunner.release();
    }
  }
}
