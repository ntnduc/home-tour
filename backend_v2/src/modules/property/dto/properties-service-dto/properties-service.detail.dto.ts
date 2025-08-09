import { ServiceDetailDto } from 'src/modules/services/dto/services.detail.dto';
import { BaseDetailDto } from '../../../../common/base/dto/detail.dto';
import { ServiceCalculationMethod } from '../../../../common/enums/service.enum';
import { PropertiesService } from '../../entities/properties-service.entity';
import { PropertyDetailDto } from '../properties-dto/property.detail.dto';

export class PropertyServiceDetailDto extends BaseDetailDto<PropertiesService> {
  propertyId: string;
  serviceId: string;
  calculationMethod: ServiceCalculationMethod;
  service: ServiceDetailDto;
  property: PropertyDetailDto;
  price: number;
  name?: string;

  fromEntity(entity: PropertiesService): void {
    this.propertyId = entity.propertyId;
    this.serviceId = entity.serviceId;
    this.calculationMethod = entity.calculationMethod;
    this.price = entity.price;
    this.name = entity.name;
    if (!this.name && entity.service) {
      this.name = entity.service.name;
    }
  }
}
