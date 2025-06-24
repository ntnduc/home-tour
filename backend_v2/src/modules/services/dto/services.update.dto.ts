import { IsOptional } from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../common/base/dto/update.dto';
import {
  ServiceCalculationMethod,
  Services,
} from '../entities/services.entity';

export class UpdateServiceDto extends BaseUpdateDto<Services> {
  @IsOptional()
  name?: string;

  @IsOptional()
  calculationMethod?: ServiceCalculationMethod;

  @IsOptional()
  defaultUnitName?: string;

  getEntity(entity: Services): QueryDeepPartialEntity<Services> {
    if (this.name) entity.name = this.name;
    if (this.calculationMethod)
      entity.calculationMethod = this.calculationMethod;
    if (this.defaultUnitName) entity.defaultUnitName = this.defaultUnitName;
    return entity;
  }
}
