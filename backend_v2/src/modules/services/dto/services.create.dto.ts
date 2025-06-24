import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ServiceCalculationMethod } from '../entities/services.entity';

import { BaseCreateDto } from '../../../common/base/dto/create.dto';
import { Services } from '../entities/services.entity';

export class CreateServiceDto extends BaseCreateDto<Services> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ServiceCalculationMethod)
  @IsNotEmpty()
  calculationMethod: ServiceCalculationMethod;

  @IsString()
  @IsOptional()
  defaultUnitName: string;

  getEntity(): Services {
    const entity = new Services();
    entity.name = this.name;
    entity.calculationMethod = this.calculationMethod;
    entity.defaultUnitName = this.defaultUnitName;
    return entity;
  }
}
