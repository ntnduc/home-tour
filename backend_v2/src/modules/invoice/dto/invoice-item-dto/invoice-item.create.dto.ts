import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { BaseCreateDto } from '../../../../common/base/dto/create.dto';
import { InvoiceItemType } from '../../../../common/enums/invoice.enum';
import { InvoiceItem } from '../../entities/invoice.item.entity';

export class InvoiceItemCreateDto extends BaseCreateDto<InvoiceItem> {
  @IsUUID()
  invoiceId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(InvoiceItemType)
  type: InvoiceItemType;

  @IsNumber()
  @IsOptional()
  helperValue?: number;

  @IsUUID()
  @IsOptional()
  contractServiceId?: string;

  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  getEntity(): InvoiceItem {
    const entity = new InvoiceItem();
    entity.invoiceId = this.invoiceId;
    entity.amount = this.amount;
    entity.type = this.type;
    entity.helperValue = this.helperValue;
    entity.contractServiceId = this.contractServiceId;
    entity.propertyId = this.propertyId;
    entity.metadata = this.metadata ?? {};
    return entity;
  }
}
