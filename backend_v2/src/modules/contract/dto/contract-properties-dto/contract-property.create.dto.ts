import { IsBoolean, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { BaseCreateDto } from '../../../../common/base/dto/create.dto';
import { ContractProperties } from '../../entities/contract-properties.entity';

export class ContractPropertyCreateDto extends BaseCreateDto<ContractProperties> {
  @IsUUID()
  @IsOptional()
  contractId?: string;

  @IsUUID()
  propertyUserId: string;

  @IsDateString()
  @IsOptional()
  moveInDate?: string;

  @IsDateString()
  @IsOptional()
  moveOutDate?: string;

  @IsBoolean()
  @IsOptional()
  isActiveInContract?: boolean;

  getEntity(): ContractProperties {
    const entity = new ContractProperties();
    if (this.contractId) entity.contractId = this.contractId;
    entity.propertyUserId = this.propertyUserId;
    entity.moveInDate = this.moveInDate ? new Date(this.moveInDate) : undefined;
    entity.moveOutDate = this.moveOutDate
      ? new Date(this.moveOutDate)
      : undefined;
    entity.isActiveInContract = this.isActiveInContract ?? true;
    return entity;
  }
}
