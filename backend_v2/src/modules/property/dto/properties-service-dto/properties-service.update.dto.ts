import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../../common/base/dto/update.dto';
import { ServiceCalculationMethod } from '../../../../common/enums/service.enum';
import { PropertiesService } from '../../entities/properties-service.entity';

export class PropertyServiceUpdateDto extends BaseUpdateDto<PropertiesService> {
  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsEnum(ServiceCalculationMethod)
  @IsOptional()
  calculationMethod?: ServiceCalculationMethod;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  getEntity(
    entity: PropertiesService,
  ): QueryDeepPartialEntity<PropertiesService> {
    if (this.propertyId) entity.propertyId = this.propertyId;
    if (this.price) entity.price = this.price;
    if (this.calculationMethod)
      entity.calculationMethod = this.calculationMethod;
    if (this.name) entity.name = this.name;
    return entity;
  }
}
