import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserModule } from '../current.user';
import { PropertiesService } from '../property/entities/properties-service.entity';
import { Properties } from '../property/entities/properties.entity';
import { Rooms } from '../property/entities/rooms.entity';
import { PropertiesServiceRepository } from '../property/repositories/properties-service.repository';
import { PropertiesRepository } from '../property/repositories/properties.repository';
import { RoomsRepository } from '../property/repositories/rooms.repository';
import { RbacModule } from '../rbac/rbac.module';
import { Services } from '../services/entities/services.entity';
import { ServicesRepository } from '../services/repositories/services.repository';
import { User } from '../users/entities/user.entity';
import { ContractPropertiesController } from './contract-properties.controller';
import { ContractPropertiesService } from './contract-properties.service';
import { ContractServicesController } from './contract-services.controller';
import { ContractServicesService } from './contract-services.service';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { ContractProperties } from './entities/contract-properties.entity';
import { ContractServices } from './entities/contract-services.entity';
import { Contracts } from './entities/contracts.entity';
import { ContractPropertiesRepository } from './repositories/contract-properties.repository';
import { ContractServicesRepository } from './repositories/contract-services.repository';
import { ContractsRepository } from './repositories/contracts.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contracts,
      Rooms,
      Properties,
      PropertiesService,
      Services,
      User,
      ContractProperties,
      ContractServices,
    ]),
    CurrentUserModule,
    RbacModule,
  ],
  providers: [
    ContractService,
    ContractPropertiesService,
    ContractServicesService,
    RoomsRepository,
    PropertiesRepository,
    PropertiesServiceRepository,
    ServicesRepository,
    ContractPropertiesRepository,
    ContractServicesRepository,
    ContractsRepository,
    ContractPropertiesRepository,
    ContractServicesRepository,
    ContractsRepository,
  ],
  exports: [
    ContractService,
    ContractPropertiesService,
    ContractServicesService,
  ],
  controllers: [
    ContractController,
    ContractPropertiesController,
    ContractServicesController,
  ],
})
export class ContractModule {}
