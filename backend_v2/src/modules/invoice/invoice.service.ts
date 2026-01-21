import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../../common/base/crud/base.service';
import { IBaseService } from '../../common/base/crud/IService';
import { InvoiceCreateDto } from './dto/invoice-dto/invoice.create.dto';
import { InvoiceDetailDto } from './dto/invoice-dto/invoice.detail.dto';
import { InvoiceListDto } from './dto/invoice-dto/invoice.list.dto';
import { InvoiceUpdateDto } from './dto/invoice-dto/invoice.update.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice.item.entity';

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
    private readonly dataSource: DataSource,
  ) {
    super(
      invoiceRepository as any,
      InvoiceDetailDto,
      InvoiceListDto,
      InvoiceCreateDto,
      InvoiceUpdateDto,
    );
  }

  async create(dto: InvoiceCreateDto): Promise<InvoiceDetailDto> {
    const entity = dto.getEntity();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const createdEntity = this.invoiceRepository.create(entity);
      await queryRunner.manager.save(createdEntity);
      entity.invoiceItems.forEach(item => {
        item.invoiceId = createdEntity.id;
        item.propertyId = createdEntity.propertyId;
      });
      
      const createdInvoiceItems = this.invoiceItemRepository.create( entity.invoiceItems);
      await queryRunner.manager.save(createdInvoiceItems);
      createdEntity.invoiceItems = createdInvoiceItems;
      await queryRunner.commitTransaction();

      const detailDto = new InvoiceDetailDto();
      detailDto.fromEntity(createdEntity);
      return detailDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async specQuery(): Promise<SelectQueryBuilder<Invoice>> {
    const query = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.contract', 'contract')
      .leftJoinAndSelect('invoice.room', 'room')
      .leftJoinAndSelect('invoice.invoiceItems', 'invoiceItems')
      .leftJoinAndSelect('invoiceItems.contractService', 'contractService');

    return query;
  }
}
