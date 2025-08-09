import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../../common/base/dto/update.dto';
import { ContractStatus } from '../../../../common/enums/contract.enum';
import { Contracts } from '../../entities/contracts.entity';

export class ContractUpdateDto implements BaseUpdateDto<Contracts> {
  @IsString()
  id: string;

  @IsOptional()
  @IsUUID()
  roomId?: string;

  // propertyId không được phép update - chỉ set khi tạo mới

  @IsOptional()
  @IsUUID()
  primaryTenantUserId?: string;

  @IsOptional()
  @IsUUID()
  landlordUserId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentAmountAgreed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmountPaid?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  paymentDueDay?: number;

  @IsOptional()
  @IsString()
  contractScanURL?: string;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  getEntity(entity: Contracts): QueryDeepPartialEntity<Contracts> {
    const updateData: QueryDeepPartialEntity<Contracts> = {};

    if (this.roomId) updateData.roomId = this.roomId;
    if (this.primaryTenantUserId)
      updateData.primaryTenantUserId = this.primaryTenantUserId;
    if (this.landlordUserId) updateData.landlordUserId = this.landlordUserId;
    if (this.startDate) updateData.startDate = new Date(this.startDate);
    if (this.endDate) updateData.endDate = new Date(this.endDate);
    if (this.rentAmountAgreed !== undefined)
      updateData.rentAmountAgreed = this.rentAmountAgreed;
    if (this.depositAmountPaid !== undefined)
      updateData.depositAmountPaid = this.depositAmountPaid;
    if (this.paymentDueDay) updateData.paymentDueDay = this.paymentDueDay;
    if (this.contractScanURL !== undefined)
      updateData.contractScanURL = this.contractScanURL;
    if (this.status) updateData.status = this.status;
    if (this.notes !== undefined) updateData.notes = this.notes;

    return updateData;
  }
}
