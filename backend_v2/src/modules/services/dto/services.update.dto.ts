import { IsNumber, IsOptional } from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../common/base/dto/update.dto';
import { Services } from '../entities/services.entity';
import { ServiceCalculationMethod } from './../../../common/enums/service.enum';

export class UpdateServiceDto extends BaseUpdateDto<Services> {
  @IsOptional()
  name?: string;

  @IsOptional()
  calculationMethod?: ServiceCalculationMethod;

  @IsOptional()
  defaultUnitName?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  getEntity(entity: Services): QueryDeepPartialEntity<Services> {
    if (this.name) entity.name = this.name;
    if (this.price) entity.price = this.price;
    if (this.calculationMethod)
      entity.calculationMethod = this.calculationMethod;
    if (this.defaultUnitName) entity.defaultUnitName = this.defaultUnitName;
    return entity;
  }
}
