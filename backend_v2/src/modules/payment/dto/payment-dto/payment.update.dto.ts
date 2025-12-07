import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUpdateDto } from '../../../../common/base/dto/update.dto';
import { PaymentStatus, PaymentType } from '../../../../common/enums/payment.enum';
import { Payment } from '../../entities/payment.entity';

export class PaymentUpdateDto implements BaseUpdateDto<Payment> {
  @IsString()
  id: string;

  @IsOptional()
  @IsUUID()
  invoiceId?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  getEntity(entity: Payment): QueryDeepPartialEntity<Payment> {
    const updateData: QueryDeepPartialEntity<Payment> = { ...entity };

    if (this.invoiceId) updateData.invoiceId = this.invoiceId;
    if (this.paymentDate)
      updateData.paymentDate = new Date(this.paymentDate);
    if (this.amount !== undefined) updateData.amount = this.amount;
    if (this.propertyId) updateData.propertyId = this.propertyId;
    if (this.type) updateData.type = this.type;
    if (this.paymentMethod !== undefined)
      updateData.paymentMethod = this.paymentMethod;
    if (this.status) updateData.status = this.status;
    if (this.notes !== undefined) updateData.notes = this.notes;

    return updateData;
  }
}

