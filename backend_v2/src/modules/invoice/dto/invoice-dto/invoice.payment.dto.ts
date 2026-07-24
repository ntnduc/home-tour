import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BaseUpdateDto } from 'src/common/base/dto/update.dto';
import { InvoiceStatus } from 'src/common/enums/invoice.enum';
import { Invoice } from '../../entities/invoice.entity';

export class InvoicePaymentDto extends BaseUpdateDto<Invoice> {
  @IsNumber()
  @Min(0)
  paidAmount: number;

  // tiền cần thanh toán hiển thị trên UI, có thể khác với remainingAmount trong DB nếu có nhiều lần thanh toán
  @IsNumber()
  @Min(0, { message: 'Số tiền thanh toán phải lớn hơn 0' })
  remainingAmount: number;

  @IsDateString()
  dueDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Không có mã hợp đồng' })
  contractId: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  paymentMethod: string;

  getEntity(entity: Invoice): Invoice {
    entity.paidAmount = this.calculatorPaidAmount(entity);
    entity.remainingAmount = this.calculatorPaidAmount(entity);
    entity.dueDate = new Date(this.dueDate);
    entity.status = InvoiceStatus.PAID;
    return entity;
  }

  calculatorPaidAmount(invoice: Invoice): number {
    let paidAmountCurrent = invoice.paidAmount ?? 0;
    paidAmountCurrent += this.remainingAmount;
    return paidAmountCurrent;
  }

  calculatorRemainingAmount(invoice: Invoice): number {
    let remainingAmountCurrent = invoice.remainingAmount ?? 0;
    remainingAmountCurrent -= this.remainingAmount;
    return remainingAmountCurrent;
  }
}
