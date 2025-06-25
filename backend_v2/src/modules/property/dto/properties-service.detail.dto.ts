import { ServiceDetailDto } from 'src/modules/services/dto/services.detail.dto';
import { BaseDetailDto } from '../../../common/base/dto/detail.dto';
import { PropertiesService } from '../entities/properties-service.entity';
import { ServiceCalculationMethod } from './../../../common/enums/service.enum';
import { PropertyDetailDto } from './property.detail.dto';

export class PropertyServiceDetailDto extends BaseDetailDto<PropertiesService> {
  propertyId: string;
  serviceId: string;
  calculationMethod: ServiceCalculationMethod;
  service: ServiceDetailDto;
  property: PropertyDetailDto;

  fromEntity(entity: PropertiesService): void {
    this.propertyId = entity.propertyId;
    this.serviceId = entity.serviceId;
    this.calculationMethod = entity.calculationMethod;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
