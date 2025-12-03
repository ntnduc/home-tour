import { Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { RequestContextService } from '../../../common/base/context/request-context.service';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { Rooms } from '../entities/rooms.entity';

@Injectable()
export class RoomsRepository extends BaseRepository<Rooms> {
  constructor(dataSource: DataSource) {
    super(Rooms, dataSource);
  }

  override globalQuery(
    query: SelectQueryBuilder<Rooms>,
  ): SelectQueryBuilder<Rooms> {
    const currentUserId = RequestContextService.getUserId();
    query.leftJoinAndSelect(`${query.alias}.property`, 'property');
    query.andWhere('property.ownerId = :currentUserId', {
      currentUserId,
    });
    return query;
  }
}
