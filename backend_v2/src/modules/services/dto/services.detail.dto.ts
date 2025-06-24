import { BaseDetailDto } from '../../../common/base/dto/detail.dto';
import {
  ServiceCalculationMethod,
  Services,
} from '../entities/services.entity';

export class ServiceDetailDto extends BaseDetailDto<Services> {
  name: string;
  calculationMethod: ServiceCalculationMethod;
  defaultUnitName: string;

  fromEntity(entity: Services): void {
    this.name = entity.name;
    this.calculationMethod = entity.calculationMethod;
    this.defaultUnitName = entity.defaultUnitName;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
