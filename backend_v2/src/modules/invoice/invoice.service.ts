import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractStatus } from 'src/common/enums/contract.enum';
import { InvoiceStatus } from 'src/common/enums/invoice.enum';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../../common/base/crud/base.service';
import { IBaseService } from '../../common/base/crud/IService';
import { Contracts } from '../contract/entities/contracts.entity';
import { InvoiceCreateDto } from './dto/invoice-dto/invoice.create.dto';
import { InvoiceDetailDto } from './dto/invoice-dto/invoice.detail.dto';
import { InvoiceListDto } from './dto/invoice-dto/invoice.list.dto';
import { InvoiceUpdateDto } from './dto/invoice-dto/invoice.update.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItemRepository } from './repositories/invoice-item.repository';
import { InvoiceRepository } from './repositories/invoice.repository';

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
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    @InjectRepository(Contracts)
    private readonly contractRepository: Repository<Contracts>,
    private readonly dataSource: DataSource,
  ) {
    super(
      invoiceRepository,
      InvoiceDetailDto,
      InvoiceListDto,
      InvoiceCreateDto,
      InvoiceUpdateDto,
    );
  }

  async create(dto: InvoiceCreateDto): Promise<InvoiceDetailDto> {
    const entity = dto.getEntity();
    entity.status = InvoiceStatus.PENDING;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const findContract = await this.contractRepository.findOne({
        where: { id: dto.contractId, roomId: dto.roomId },
      });
      if (!findContract) {
        throw new NotFoundException('Hợp đồng không tồn tại');
      }

      if (findContract.status !== ContractStatus.ACTIVE) {
        throw new BadRequestException('Hợp đồng không hoạt động');
      }

      const findPreInvoice = await this.invoiceRepository.findOne({
        where: {
          contractId: dto.contractId,
          roomId: dto.roomId,
        },
        order: {
          createdAt: 'DESC',
        },
      });

      if (findPreInvoice) {
        entity.preInvoiceId = findPreInvoice.id;
      }

      const createdEntity = this.invoiceRepository.create(entity);
      await queryRunner.manager.save(createdEntity);
      entity.invoiceItems.forEach((item) => {
        item.invoiceId = createdEntity.id;
        item.propertyId = createdEntity.propertyId;
      });

      const createdInvoiceItems = this.invoiceItemRepository.create(
        entity.invoiceItems,
      );
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

  async get(id: string): Promise<InvoiceDetailDto> {
    const entity = await this.invoiceRepository.findOne({
      where: {
        id: id as any,
      },
      relations: [
        'contract',
        'contract.contractClient',
        'room',
        'property',
        'invoiceItems',
      ],
    });

    if (!entity) {
      throw new NotFoundException('Không tìm thấy dữ liệu!');
    }
    const detailDto = new InvoiceDetailDto();
    detailDto.fromEntity(entity);
    return detailDto;
  }

  // private async calculatorBillingPeriod(invoice: Invoice, contract: Contracts) {

  //   const start = new Date(contract.startDate);
  //   const end = new Date(contract.endDate);
  //   return { start, end };
  // }

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
