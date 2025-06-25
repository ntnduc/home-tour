import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../common/base/dto/update.dto';
import { PropertiesService } from '../entities/properties-service.entity';
import { ServiceCalculationMethod } from './../../../common/enums/service.enum';

export class UpdatePropertyServiceDto extends BaseUpdateDto<PropertiesService> {
  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsEnum(ServiceCalculationMethod)
  @IsOptional()
  calculationMethod?: ServiceCalculationMethod;

  getEntity(
    entity: PropertiesService,
  ): QueryDeepPartialEntity<PropertiesService> {
    if (this.propertyId) entity.propertyId = this.propertyId;
    if (this.serviceId) entity.serviceId = this.serviceId;
    if (this.calculationMethod)
      entity.calculationMethod = this.calculationMethod;
    return entity;
  }
}
