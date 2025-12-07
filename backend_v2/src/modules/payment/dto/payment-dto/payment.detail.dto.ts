import { InvoiceDetailDto } from 'src/modules/invoice/dto/invoice-dto/invoice.detail.dto';
import { PropertyDetailDto } from 'src/modules/property/dto/properties-dto/property.detail.dto';
import { BaseDetailDto } from '../../../../common/base/dto/detail.dto';
import { PaymentStatus, PaymentType } from '../../../../common/enums/payment.enum';
import { Payment } from '../../entities/payment.entity';

export class PaymentDetailDto extends BaseDetailDto<Payment> {
  invoiceId: string;
  paymentDate: Date;
  amount: number;
  propertyId: string;
  type: PaymentType;
  paymentMethod?: string;
  status: PaymentStatus;
  notes?: string;
  invoice: InvoiceDetailDto;
  property: PropertyDetailDto;

  fromEntity(entity: Payment): void {
    this.id = entity.id;
    this.invoiceId = entity.invoiceId;
    this.paymentDate = entity.paymentDate;
    this.amount = entity.amount ? Number(entity.amount) : 0;
    this.propertyId = entity.propertyId;
    this.type = entity.type;
    this.paymentMethod = entity.paymentMethod;
    this.status = entity.status;
    this.notes = entity.notes;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;

    if (entity.invoice) {
      this.invoice = new InvoiceDetailDto();
      this.invoice.fromEntity(entity.invoice);
    }

    if (entity.property) {
      this.property = new PropertyDetailDto();
      this.property.fromEntity(entity.property);
    }
  }
}

