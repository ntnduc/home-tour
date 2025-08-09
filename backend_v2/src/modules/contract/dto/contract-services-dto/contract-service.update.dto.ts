import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../../common/base/dto/update.dto';
import { ContractServices } from '../../entities/contract-services.entity';

export class ContractServiceUpdateDto implements BaseUpdateDto<ContractServices> {
  @IsString()
  id: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  customPrice?: number;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
  getEntity(entity: ContractServices): QueryDeepPartialEntity<ContractServices> {
    const updateData: QueryDeepPartialEntity<ContractServices> = {};

    if (this.serviceId) updateData.serviceId = this.serviceId;
    if (this.customPrice !== undefined)
      updateData.customPrice = this.customPrice;
    if (this.isEnabled !== undefined) updateData.isEnabled = this.isEnabled;
    if (this.notes !== undefined) updateData.notes = this.notes;

    return updateData;
  }
}
