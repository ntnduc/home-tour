import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { BaseCreateDto } from '../../../../common/base/dto/create.dto';
import { ContractStatus } from '../../../../common/enums/contract.enum';
import { Contracts } from '../../entities/contracts.entity';
import { ContractPropertyCreateDto } from '../contract-properties-dto/contract-property.create.dto';
import { ContractServiceCreateDto } from '../contract-services-dto/contract-service.create.dto';

export class ContractCreateDto extends BaseCreateDto<Contracts> {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  roomId: string;

  @IsUUID()
  primaryTenantUserId: string;

  @IsUUID()
  landlordUserId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(0)
  rentAmountAgreed: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  depositAmountPaid?: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  paymentDueDay: number;

  @IsString()
  @IsOptional()
  contractScanURL?: string;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  contractProperties?: ContractPropertyCreateDto[];

  @IsArray()
  @IsOptional()
  contractServices?: ContractServiceCreateDto[];

  getEntity(): Contracts {
    const entity = new Contracts();
    entity.propertyId = this.propertyId;
    entity.roomId = this.roomId;
    entity.primaryTenantUserId = this.primaryTenantUserId;
    entity.landlordUserId = this.landlordUserId;
    entity.startDate = new Date(this.startDate);
    entity.endDate = this.endDate ? new Date(this.endDate) : undefined;
    entity.rentAmountAgreed = this.rentAmountAgreed;
    entity.depositAmountPaid = this.depositAmountPaid ?? 0;
    entity.paymentDueDay = this.paymentDueDay;
    entity.contractScanURL = this.contractScanURL;
    entity.status = this.status ?? ContractStatus.PENDING_START;
    entity.notes = this.notes;
    if (this.contractProperties) {
      this.contractProperties.forEach((property) => {
        entity.contractProperties.push(property.getEntity());
      });
    }
    if (this.contractServices) {
      this.contractServices.forEach((service) => {
        entity.contractServices.push(service.getEntity());
      });
    }
    return entity;
  }
}
