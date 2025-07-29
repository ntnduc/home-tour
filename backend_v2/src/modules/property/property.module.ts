import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserModule } from '../current.user';
import { Districts } from '../location/entities/Districts.entity';
import { Provinces } from '../location/entities/Provinces.entity';
import { Wards } from '../location/entities/Wards.entity';
import { Services } from '../services/entities/services.entity';
import { ServicesRepository } from '../services/repositories/services.repository';
import { PropertiesService } from './entities/properties-service.entity';
import { Properties } from './entities/properties.entity';
import { Rooms } from './entities/rooms.entity';
import { PropertiesServiceService } from './properties-service.service';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PropertiesServiceRepository } from './repositories/properties-service.repository';
import { PropertiesRepository } from './repositories/properties.repository';
import { RoomsRepository } from './repositories/rooms.repository';
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
    CurrentUserModule,
  ],
  providers: [
    PropertyService,
    PropertiesServiceService,
    RoomsService,
    PropertiesRepository,
    PropertiesServiceRepository,
    RoomsRepository,
    ServicesRepository,
  ],
  exports: [
    PropertyService,
    PropertiesServiceService,
    RoomsService,
    PropertiesRepository,
    PropertiesServiceRepository,
    RoomsRepository,
  ],
  controllers: [PropertyController, RoomsController],
})
export class PropertyModule {}
