import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../../common/base/dto/update.dto';
import { ServiceCalculationMethod } from '../../../../common/enums/service.enum';
import { PropertiesService } from '../../entities/properties-service.entity';

export class UpdatePropertyServiceDto extends BaseUpdateDto<PropertiesService> {
  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsEnum(ServiceCalculationMethod)
  @IsOptional()
  calculationMethod?: ServiceCalculationMethod;

  @IsNumber()
  @IsOptional()
  price?: number;

  getEntity(
    entity: PropertiesService,
  ): QueryDeepPartialEntity<PropertiesService> {
    if (this.propertyId) entity.propertyId = this.propertyId;
    if (this.price) entity.price = this.price;
    if (this.calculationMethod)
      entity.calculationMethod = this.calculationMethod;
    return entity;
  }
}
