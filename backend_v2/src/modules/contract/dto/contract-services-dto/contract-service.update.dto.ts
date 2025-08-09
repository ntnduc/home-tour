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
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../../common/base/dto/update.dto';
import { ContractServices } from '../../entities/contract-services.entity';

export class ContractServiceUpdateDto
  implements BaseUpdateDto<ContractServices>
{
  @IsString()
  id: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(ServiceCalculationMethod)
  calculationMethod?: ServiceCalculationMethod;

  getEntity(
    entity: ContractServices,
  ): QueryDeepPartialEntity<ContractServices> {
    const updateData: QueryDeepPartialEntity<ContractServices> = {};

    if (this.serviceId) updateData.serviceId = this.serviceId;
    if (this.price !== undefined) updateData.price = this.price;
    if (this.isEnabled !== undefined) updateData.isEnabled = this.isEnabled;
    if (this.notes !== undefined) updateData.notes = this.notes;
    if (this.calculationMethod !== undefined)
      updateData.calculationMethod = this.calculationMethod;
    return updateData;
  }
}
