import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../../common/base/dto/update.dto';
import { ContractClient } from '../../entities/contract-client.entity';

export class ContractClientUpdateDto implements BaseUpdateDto<ContractClient> {
  @IsString()
  id: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsBoolean()
  isLandlordClient?: boolean;

  @IsOptional()
  @IsDateString()
  moveInDate?: string;

  @IsOptional()
  @IsDateString()
  moveOutDate?: string;

  @IsOptional()
  @IsBoolean()
  isActiveInContract?: boolean;

  getEntity(entity: ContractClient): QueryDeepPartialEntity<ContractClient> {
    const updateData: QueryDeepPartialEntity<ContractClient> = {};

    if (this.clientId) updateData.clientId = this.clientId;
    if (this.isLandlordClient)
      updateData.isLandlordClient = this.isLandlordClient;
    if (this.moveInDate) updateData.moveInDate = new Date(this.moveInDate);
    if (this.moveOutDate) updateData.moveOutDate = new Date(this.moveOutDate);
    if (this.isActiveInContract !== undefined)
      updateData.isActiveInContract = this.isActiveInContract;

    return updateData;
  }
}
