import { IsOptional, IsString } from 'class-validator';

import { BaseListDto } from '../../../common/base/dto/list.dto';
import { Services } from '../entities/services.entity';

export class ServiceListDto extends BaseListDto<Services> {
  @IsString()
  @IsOptional()
  defaultUnitName?: string;

  @IsString()
  @IsOptional()
  name?: string;

  calculationMethod?: string;

  fromEntity(entity: Services): void {
    this.id = entity.id;
    this.name = entity.name;
    this.calculationMethod = entity.calculationMethod;
    this.defaultUnitName = entity.defaultUnitName;
  }
}
