import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../../common/base/dto/update.dto';
import { ContractProperties } from '../../entities/contract-properties.entity';

export class ContractPropertyUpdateDto implements BaseUpdateDto<ContractProperties> {
  @IsString()
  id: string;

  @IsOptional()
  @IsUUID()
  propertyUserId?: string;

  @IsOptional()
  @IsDateString()
  moveInDate?: string;

  @IsOptional()
  @IsDateString()
  moveOutDate?: string;

  @IsOptional()
  @IsBoolean()
  isActiveInContract?: boolean;

  getEntity(entity: ContractProperties): QueryDeepPartialEntity<ContractProperties> {
    const updateData: QueryDeepPartialEntity<ContractProperties> = {};

    if (this.propertyUserId) updateData.propertyUserId = this.propertyUserId;
    if (this.moveInDate) updateData.moveInDate = new Date(this.moveInDate);
    if (this.moveOutDate) updateData.moveOutDate = new Date(this.moveOutDate);
    if (this.isActiveInContract !== undefined)
      updateData.isActiveInContract = this.isActiveInContract;

    return updateData;
  }
}
