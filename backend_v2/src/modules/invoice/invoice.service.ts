import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../../common/base/crud/base.service';
import { IBaseService } from '../../common/base/crud/IService';
import { InvoiceCreateDto } from './dto/invoice-dto/invoice.create.dto';
import { InvoiceDetailDto } from './dto/invoice-dto/invoice.detail.dto';
import { InvoiceListDto } from './dto/invoice-dto/invoice.list.dto';
import { InvoiceUpdateDto } from './dto/invoice-dto/invoice.update.dto';
import { InvoiceItemCreateDto } from './dto/invoice-item-dto/invoice-item.create.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice.item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceService
  extends BaseService<
    Invoice,
    InvoiceDetailDto,
    InvoiceListDto,
    InvoiceCreateDto,
    InvoiceUpdateDto
  >
  implements
    IBaseService<
      Invoice,
      InvoiceDetailDto,
      InvoiceListDto,
      InvoiceCreateDto,
      InvoiceUpdateDto
    >
{
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
  ) {
    super(
      invoiceRepository as any,
      InvoiceDetailDto,
      InvoiceListDto,
      InvoiceCreateDto,
      InvoiceUpdateDto,
    );
  }

  async specQuery(): Promise<SelectQueryBuilder<Invoice>> {
    const query = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.contract', 'contract')
      .leftJoinAndSelect('invoice.room', 'room')
      .leftJoinAndSelect('invoice.property', 'property')
      .leftJoinAndSelect('invoice.invoiceItems', 'invoiceItems')
      .leftJoinAndSelect('invoiceItems.propertyService', 'propertyService')
      .leftJoinAndSelect('invoiceItems.contractService', 'contractService');

    return query;
  }
}

