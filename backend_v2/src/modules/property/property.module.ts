import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../services/entities/services.entity';
import { PropertiesService } from './entities/properties-service.entity';
import { Properties } from './entities/properties.entity';
import { PropertiesServiceService } from './properties-service.service';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Properties, PropertiesService, Services]),
  ],
  providers: [PropertyService, PropertiesServiceService],
  exports: [PropertyService, PropertiesServiceService],
  controllers: [PropertyController],
})
export class PropertyModule {}
