import { Injectable } from '@nestjs/common';
import { RequestContextService } from 'src/common/base/context/request-context.service';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { Invoice } from '../entities/invoice.entity';

@Injectable()
export class InvoiceRepository extends BaseRepository<Invoice> {
  constructor(dataSource: DataSource) {
    super(Invoice, dataSource);
  }

  override globalQuery(
    query: SelectQueryBuilder<Invoice>,
  ): SelectQueryBuilder<Invoice> {
    const currentUserId = RequestContextService.getUserId();
    
    // Join với property để filter theo owner
    query.leftJoinAndSelect(`${query.alias}.property`, 'property');
    query.andWhere('property.ownerId = :currentUserId', {
      currentUserId,
    });
    
    return query;
  }
}
