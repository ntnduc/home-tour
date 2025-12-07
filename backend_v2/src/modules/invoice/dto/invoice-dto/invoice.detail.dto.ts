import { ContractDetailDto } from 'src/modules/contract/dto/contract-dto/contract.detail.dto';
import { PropertyDetailDto } from 'src/modules/property/dto/properties-dto/property.detail.dto';
import { RoomDetailDto } from 'src/modules/property/dto/room-dto/room.detail.dto';
import { BaseDetailDto } from '../../../../common/base/dto/detail.dto';
import { InvoiceStatus } from '../../../../common/enums/invoice.enum';
import { Invoice } from '../../entities/invoice.entity';
import { InvoiceItemDetailDto } from '../invoice-item-dto/invoice-item.detail.dto';

export class InvoiceDetailDto extends BaseDetailDto<Invoice> {
  contractId: string;
  roomId: string;
  propertyId: string;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  dueDate: Date;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  notes?: string;
  contract: ContractDetailDto;
  room: RoomDetailDto;
  property: PropertyDetailDto;
  invoiceItems: Array<InvoiceItemDetailDto>;

  fromEntity(entity: Invoice): void {
    this.id = entity.id;
    this.contractId = entity.contractId;
    this.roomId = entity.roomId;
    this.propertyId = entity.propertyId;
    this.billingPeriodStart = entity.billingPeriodStart;
    this.billingPeriodEnd = entity.billingPeriodEnd;
    this.dueDate = entity.dueDate;
    this.totalAmount = entity.totalAmount ? Number(entity.totalAmount) : 0;
    this.paidAmount = entity.paidAmount ? Number(entity.paidAmount) : 0;
    this.remainingAmount = entity.remainingAmount
      ? Number(entity.remainingAmount)
      : 0;
    this.status = entity.status;
    this.notes = entity.notes;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.createdBy = entity.createdBy;
    this.updatedBy = entity.updatedBy;

    if (entity.contract) {
      this.contract = new ContractDetailDto();
      this.contract.fromEntity(entity.contract);
    }

    if (entity.room) {
      this.room = new RoomDetailDto();
      this.room.fromEntity(entity.room);
    }

    if (entity.property) {
      this.property = new PropertyDetailDto();
      this.property.fromEntity(entity.property);
    }

    if (entity.invoiceItems) {
      this.invoiceItems = entity.invoiceItems.map((item) => {
        const invoiceItemDetailDto = new InvoiceItemDetailDto();
        invoiceItemDetailDto.fromEntity(item);
        return invoiceItemDetailDto;
      });
    }
  }
}
