import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseCreateDto } from '../../../../common/base/dto/create.dto';
import { ServiceCalculationMethod } from '../../../../common/enums/service.enum';
import { PropertiesService } from '../../entities/properties-service.entity';

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

  @IsNumber()
  @IsNotEmpty()
  price: number;

  getEntity(): PropertiesService {
    const entity = new PropertiesService();
    entity.propertyId = this.propertyId;
    entity.serviceId = this.serviceId;
    entity.calculationMethod = this.calculationMethod;
    entity.price = this.price;
    return entity;
  }
}
