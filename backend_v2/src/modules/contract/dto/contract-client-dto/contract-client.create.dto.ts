import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { BaseCreateDto } from '../../../../common/base/dto/create.dto';
import { ContractClient } from '../../entities/contract-client.entity';

export class ContractClientCreateDto extends BaseCreateDto<ContractClient> {
  @IsUUID()
  @IsOptional()
  contractId?: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsBoolean()
  @IsOptional()
  isLandlordClient?: boolean;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsDateString()
  @IsOptional()
  moveInDate?: string;

  @IsDateString()
  @IsOptional()
  moveOutDate?: string;

  @IsBoolean()
  @IsOptional()
  isActiveInContract?: boolean;

  getEntity(): ContractClient {
    const entity = new ContractClient();
    if (this.contractId) entity.contractId = this.contractId;
    if (this.clientId) entity.clientId = this.clientId;
    entity.name = this.name;
    entity.isLandlordClient = this.isLandlordClient ?? false;
    entity.moveInDate = this.moveInDate ? new Date(this.moveInDate) : undefined;
    entity.moveOutDate = this.moveOutDate
      ? new Date(this.moveOutDate)
      : undefined;
    entity.isActiveInContract = this.isActiveInContract ?? true;
    return entity;
  }
}
