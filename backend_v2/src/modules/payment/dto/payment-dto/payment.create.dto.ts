import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { BaseCreateDto } from '../../../../common/base/dto/create.dto';
import {
  PaymentStatus,
  PaymentType,
} from '../../../../common/enums/payment.enum';
import { Payment } from '../../entities/payment.entity';

export class PaymentCreateDto extends BaseCreateDto<Payment> {
  @IsUUID()
  invoiceId: string;

  @IsDateString()
  paymentDate: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsUUID()
  propertyId: string;

  @IsEnum(PaymentType)
  type: PaymentType;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  getEntity(): Payment {
    const entity = new Payment();
    entity.invoiceId = this.invoiceId;
    entity.paymentDate = new Date(this.paymentDate);
    entity.amount = this.amount;
    entity.propertyId = this.propertyId;
    entity.type = this.type;
    entity.paymentMethod = this.paymentMethod ?? 'CASH';
    entity.status = this.status ?? PaymentStatus.PENDING;
    entity.notes = this.notes;
    return entity;
  }
}
