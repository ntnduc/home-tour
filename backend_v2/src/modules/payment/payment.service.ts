import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../../common/base/crud/base.service';
import { IBaseService } from '../../common/base/crud/IService';
import { PaymentCreateDto } from './dto/payment-dto/payment.create.dto';
import { PaymentDetailDto } from './dto/payment-dto/payment.detail.dto';
import { PaymentListDto } from './dto/payment-dto/payment.list.dto';
import { PaymentUpdateDto } from './dto/payment-dto/payment.update.dto';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService
  extends BaseService<
    Payment,
    PaymentDetailDto,
    PaymentListDto,
    PaymentCreateDto,
    PaymentUpdateDto
  >
  implements
    IBaseService<
      Payment,
      PaymentDetailDto,
      PaymentListDto,
      PaymentCreateDto,
      PaymentUpdateDto
    >
{
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    super(
      paymentRepository as any,
      PaymentDetailDto,
      PaymentListDto,
      PaymentCreateDto,
      PaymentUpdateDto,
    );
  }

  async specQuery(): Promise<SelectQueryBuilder<Payment>> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.invoice', 'invoice')
      .leftJoinAndSelect('payment.property', 'property');

    return query;
  }
}

