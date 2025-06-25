import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ServiceCalculationMethod } from './../../../common/enums/service.enum';

import { BaseCreateDto } from '../../../common/base/dto/create.dto';
import { Services } from '../entities/services.entity';

export class CreateServiceDto extends BaseCreateDto<Services> {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsEnum(ServiceCalculationMethod, {
    message: 'Phương thức tính không hợp lệ!',
  })
  @IsNotEmpty()
  calculationMethod: ServiceCalculationMethod;

  @IsString()
  @IsOptional()
  defaultUnitName?: string;

  getEntity(): Services {
    const entity = new Services();
    entity.name = this.name;
    entity.calculationMethod = this.calculationMethod;
    entity.defaultUnitName = this.defaultUnitName ?? '';
    return entity;
  }
}
