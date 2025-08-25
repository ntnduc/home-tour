import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ServiceCalculationMethod } from 'src/common/enums/service.enum';
import { BaseCreateDto } from '../../../../common/base/dto/create.dto';
import { ContractServices } from '../../entities/contract-services.entity';

export class ContractServiceCreateDto extends BaseCreateDto<ContractServices> {
  @IsUUID()
  @IsOptional()
  contractId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUUID()
  @IsOptional()
  propertyServiceId?: string;

  @IsEnum(ServiceCalculationMethod)
  calculationMethod: ServiceCalculationMethod;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isSelectedFromService?: boolean;

  getEntity(): ContractServices {
    const entity = new ContractServices();
    if (this.contractId) entity.contractId = this.contractId;
    entity.price = this.price ?? 0;
    entity.isEnabled = this.isEnabled ?? true;
    entity.notes = this.notes;
    if (this.propertyServiceId)
      entity.propertyServiceId = this.propertyServiceId;
    entity.calculationMethod = this.calculationMethod;
    return entity;
  }
}
