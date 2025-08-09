import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { BaseCreateDto } from '../../../../common/base/dto/create.dto';
import { ContractServices } from '../../entities/contract-services.entity';

export class ContractServiceCreateDto extends BaseCreateDto<ContractServices> {
  @IsUUID()
  @IsOptional()
  contractId?: string;

  @IsUUID()
  serviceId: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  customPrice?: number;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  // Thêm field để xử lý trường hợp clone từ property service
  @IsUUID()
  @IsOptional()
  propertyServiceId?: string;

  getEntity(): ContractServices {
    const entity = new ContractServices();
    if (this.contractId) entity.contractId = this.contractId;
    entity.serviceId = this.serviceId;
    entity.customPrice = this.customPrice;
    entity.isEnabled = this.isEnabled ?? true;
    entity.notes = this.notes;
    return entity;
  }
}
