import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../services/entities/services.entity';
import { PropertiesService } from './entities/properties-service.entity';
import { Properties } from './entities/properties.entity';
import { Rooms } from './entities/rooms.entity';
import { PropertiesServiceService } from './properties-service.service';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Properties, PropertiesService, Services, Rooms]),
  ],
  providers: [PropertyService, PropertiesServiceService, RoomsService],
  exports: [PropertyService, PropertiesServiceService, RoomsService],
  controllers: [PropertyController, RoomsController],
})
export class PropertyModule {}
