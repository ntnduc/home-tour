import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { BaseCreateDto } from '../../../../common/base/dto/create.dto';
import { Contracts } from '../../entities/contracts.entity';
import { ContractClientCreateDto } from '../contract-client-dto/contract-client.create.dto';
import { ContractServiceCreateDto } from '../contract-services-dto/contract-service.create.dto';

export class ContractCreateDto extends BaseCreateDto<Contracts> {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  roomId: string;

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
  @Min(0)
  @IsOptional()
  partnerClientCount?: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  paymentDueDay: number;

  @IsString()
  @IsOptional()
  contractScanURL?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  contractClient?: ContractClientCreateDto[];

  //TODO: Feature not implemented yet
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractServiceCreateDto)
  @IsOptional()
  contractServices?: ContractServiceCreateDto[];

  getEntity(): Contracts {
    const entity = new Contracts();
    entity.propertyId = this.propertyId;
    entity.roomId = this.roomId;
    entity.startDate = new Date(this.startDate);
    entity.endDate = this.endDate ? new Date(this.endDate) : undefined;
    entity.rentAmountAgreed = this.rentAmountAgreed;
    entity.depositAmountPaid = this.depositAmountPaid ?? 0;
    entity.paymentDueDay = this.paymentDueDay;
    entity.contractScanURL = this.contractScanURL;
    entity.notes = this.notes;
    entity.partnerClientCount = this.partnerClientCount ?? 0;
    return entity;
  }
}
