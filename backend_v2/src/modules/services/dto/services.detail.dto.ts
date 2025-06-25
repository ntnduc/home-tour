import { BaseDetailDto } from '../../../common/base/dto/detail.dto';
import { Services } from '../entities/services.entity';
import { ServiceCalculationMethod } from './../../../common/enums/service.enum';

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
