import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './entities/services.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Services])],
  providers: [ServicesService],
  exports: [ServicesService],
  controllers: [ServicesController],
})
export class ServicesModule {}
