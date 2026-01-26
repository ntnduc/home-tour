import { Injectable } from '@nestjs/common';
import { RequestContextService } from 'src/common/base/context/request-context.service';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { InvoiceItem } from '../entities/invoice.item.entity';

@Injectable()
export class InvoiceItemRepository extends BaseRepository<InvoiceItem> {
  constructor(dataSource: DataSource) {
    super(InvoiceItem, dataSource);
  }

  override globalQuery(
    query: SelectQueryBuilder<InvoiceItem>,
  ): SelectQueryBuilder<InvoiceItem> {
    const currentUserId = RequestContextService.getUserId();
    
    // Join với property để filter theo owner
    query.leftJoinAndSelect(`${query.alias}.property`, 'property');
    query.andWhere('property.ownerId = :currentUserId', {
      currentUserId,
    });
    
    return query;
  }
}
