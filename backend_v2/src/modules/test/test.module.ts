import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestChild } from './entities/test-child.entity';
import { TestContent } from './entities/test-content.entity';
import { TestMapping } from './entities/test-mapping.entity';
import { Test } from './entities/test.entity';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test, TestChild, TestContent, TestMapping]),
  ],
  providers: [TestService],
  exports: [TestService],
  controllers: [TestController],
})
export class TestModule {}
