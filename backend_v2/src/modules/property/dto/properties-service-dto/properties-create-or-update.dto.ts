import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ServiceCalculationMethod } from 'src/common/enums/service.enum';
import { Services } from 'src/modules/services/entities/services.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PropertiesService } from '../../entities/properties-service.entity';

export class PropertiesCreateOrUpdateDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  serviceId?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(ServiceCalculationMethod)
  @IsOptional()
  calculationMethod: ServiceCalculationMethod;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  getUpdateEntity(
    entity: PropertiesService,
  ): QueryDeepPartialEntity<PropertiesService> {
    if (this.price) entity.price = this.price;
    if (this.calculationMethod)
      entity.calculationMethod = this.calculationMethod;
    if (this.name) entity.name = this.name;
    return entity;
  }

  getNewEntity(propertyId: string, serviceId: string): PropertiesService {
    const entity = new PropertiesService();
    entity.propertyId = propertyId;
    entity.serviceId = serviceId;
    entity.price = this.price ?? 0;
    entity.calculationMethod = this.calculationMethod;
    entity.name = this.name ?? '';
    return entity;
  }

  getNewServiceAndPropertyService(propertyId: string): PropertiesService {
    const service = new Services();
    service.name = this.name;
    service.price = this.price;
    service.calculationMethod = this.calculationMethod;

    const propertyService = new PropertiesService();

    propertyService.propertyId = propertyId;
    propertyService.price = service.price;
    propertyService.calculationMethod = service.calculationMethod;
    propertyService.name = service.name;
    propertyService.service = service;
    return propertyService;
  }
}
