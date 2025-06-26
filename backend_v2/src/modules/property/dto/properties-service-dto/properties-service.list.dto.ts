import { BaseListDto } from '../../../../common/base/dto/list.dto';
import { ServiceCalculationMethod } from '../../../../common/enums/service.enum';
import { PropertiesService } from '../../entities/properties-service.entity';

export class PropertyServiceListDto extends BaseListDto<PropertiesService> {
  propertyId: string;
  serviceId: string;
  calculationMethod: ServiceCalculationMethod;

  fromEntity(entity: PropertiesService): void {
    this.propertyId = entity.propertyId;
    this.serviceId = entity.serviceId;
    this.calculationMethod = entity.calculationMethod;
  }
}
