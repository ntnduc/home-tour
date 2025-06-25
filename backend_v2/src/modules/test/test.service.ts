import { BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { DataSource, In, Repository } from 'typeorm';
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
    @InjectRepository(TestContent)
    private testContentRepository: Repository<TestContent>,
    @InjectRepository(TestMapping)
    private testMappingRepository: Repository<TestMapping>,
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
      const newTestEntity = this.testRepository.create(testEnity);
      await queryRunner.manager.save(newTestEntity);

      if (dto.testContent && dto.testContent.length > 0) {
        const testContentIds = dto.testContent
          .filter((testContent) => testContent.id)
          .map((testContent) => testContent.id);

        const findTestContentExit = await this.testContentRepository.find({
          where: {
            id: In(testContentIds),
          },
        });

        const testContentUnExited = dto.testContent.filter(
          (testContent) =>
            !findTestContentExit.find(
              (testContentExit) => testContentExit.id === testContent.id,
            ),
        );

        const testContentEntities = testContentUnExited.map((testContent) => {
          const testContentEntity = new TestContent();
          testContentEntity.name = testContent.name;
          return testContentEntity;
        });

        const newTestContent =
          this.testContentRepository.create(testContentEntities);
        await queryRunner.manager.save(newTestContent);

        const allTestContents = [...newTestContent, ...findTestContentExit];

        const testMapping = allTestContents.map((testContentEntity) => {
          const testMappingEntity = new TestMapping();
          testMappingEntity.test_content_id = testContentEntity.id;
          testMappingEntity.test_id = newTestEntity.id;
          testMappingEntity.name = testContentEntity.name;
          return testMappingEntity;
        });
        this.testMappingRepository.create(testMapping);
        await queryRunner.manager.save(testMapping);
      }

      await queryRunner.commitTransaction();

      const result = new TestDetailDto();
      result.fromEntity(newTestEntity);
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException('Lỗi test mapping');
    } finally {
      await queryRunner.release();
    }
  }
}
