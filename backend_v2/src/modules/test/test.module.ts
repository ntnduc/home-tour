import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestChild } from './entities/test-child.entity';
import { TestContent } from './entities/test-content.entity';
import { TestMapping } from './entities/test-mapping.entity';
import { Test } from './entities/test.entity';
import { TestChildRepository } from './repositories/test.child.repository';
import { TestContentRepository } from './repositories/test.content.repository';
import { TestMappingRepository } from './repositories/test.mapping.repository';
import { TestRepository } from './repositories/test.repository';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test, TestChild, TestContent, TestMapping]),
  ],
  providers: [
    TestService,
    TestRepository,
    TestChildRepository,
    TestMappingRepository,
    TestContentRepository,
  ],
  exports: [
    TestService,
    TestRepository,
    TestChildRepository,
    TestMappingRepository,
    TestContentRepository,
  ],
  controllers: [TestController],
})
export class TestModule {}
