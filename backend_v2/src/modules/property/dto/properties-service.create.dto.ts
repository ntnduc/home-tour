import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseCreateDto } from '../../../common/base/dto/create.dto';
import { PropertiesService } from '../entities/properties-service.entity';
import { ServiceCalculationMethod } from './../../../common/enums/service.enum';

export class CreatePropertyServiceDto extends BaseCreateDto<PropertiesService> {
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsEnum(ServiceCalculationMethod)
  @IsNotEmpty()
  calculationMethod: ServiceCalculationMethod;

  getEntity(): PropertiesService {
    const entity = new PropertiesService();
    entity.propertyId = this.propertyId;
    entity.serviceId = this.serviceId;
    entity.calculationMethod = this.calculationMethod;
    return entity;
  }
}
