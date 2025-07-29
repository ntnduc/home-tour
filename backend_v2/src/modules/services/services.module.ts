import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './entities/services.entity';
import { ServicesRepository } from './repositories/services.repository';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Services])],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService, ServicesRepository],
  controllers: [ServicesController],
})
export class ServicesModule {}
