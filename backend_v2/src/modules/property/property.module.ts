import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Districts } from '../location/entities/Districts.entity';
import { Provinces } from '../location/entities/Provinces.entity';
import { Wards } from '../location/entities/Wards.entity';
import { Services } from '../services/entities/services.entity';
import { PropertiesService } from './entities/properties-service.entity';
import { Properties } from './entities/properties.entity';
import { Rooms } from './entities/rooms.entity';
import { PropertiesServiceService } from './properties-service.service';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PropertiesRepository } from './repositories/properties.repository';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Properties,
      PropertiesService,
      Services,
      Rooms,
      Provinces,
      Districts,
      Wards,
    ]),
  ],
  providers: [
    PropertyService,
    PropertiesServiceService,
    RoomsService,
    PropertiesRepository,
  ],
  exports: [
    PropertyService,
    PropertiesServiceService,
    RoomsService,
    PropertiesRepository,
  ],
  controllers: [PropertyController, RoomsController],
})
export class PropertyModule {}
