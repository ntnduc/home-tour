import { BaseDetailDto } from '../../../common/base/dto/detail.dto';
import { Services } from '../entities/services.entity';
import { ServiceCalculationMethod } from './../../../common/enums/service.enum';

export class ServiceDetailDto extends BaseDetailDto<Services> {
  name: string;
  calculationMethod: ServiceCalculationMethod;
  defaultUnitName: string;
  price: number;
  icon?: string;

  fromEntity(entity: Services): void {
    this.name = entity.name;
    this.id = entity.id;
    this.icon = entity.icon;
    this.calculationMethod = entity.calculationMethod;
    this.defaultUnitName = entity.defaultUnitName;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.price = entity.price;
  }
}
