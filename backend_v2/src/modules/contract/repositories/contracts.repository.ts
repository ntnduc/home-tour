import { Injectable } from '@nestjs/common';
import { RequestContextService } from 'src/common/base/context/request-context.service';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { Contracts } from '../entities/contracts.entity';

@Injectable()
export class ContractsRepository extends BaseRepository<Contracts> {
  constructor(dataSource: DataSource) {
    super(Contracts, dataSource);
  }

  // override globalQuery(
  //   query: SelectQueryBuilder<Contracts>,
  // ): SelectQueryBuilder<Contracts> {
  //   const currentUserId = RequestContextService.getUserId();

  //   // Chỉ hiển thị hợp đồng mà user là chủ nhà hoặc người thuê chính
  //   query.andWhere(
  //     `(${query.alias}.landlordUserId = :currentUserId OR ${query.alias}.primaryTenantUserId = :currentUserId)`,
  //     { currentUserId },
  //   );

  //   return query;
  // }

  override globalQuery(
    query: SelectQueryBuilder<Contracts>,
  ): SelectQueryBuilder<Contracts> {
    const currentUserId = RequestContextService.getUserId();
    query.leftJoinAndSelect(`${query.alias}.property`, 'property');
    query.andWhere('property.ownerId = :currentUserId', {
      currentUserId,
    });
    return query;
  }
}
