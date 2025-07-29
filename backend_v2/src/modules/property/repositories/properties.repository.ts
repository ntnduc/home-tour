import { Injectable } from '@nestjs/common';
import { RequestContextService } from 'src/common/base/context/request-context.service';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/BaseRepository';
import { Properties } from '../entities/properties.entity';

@Injectable()
export class PropertiesRepository extends BaseRepository<Properties> {
  constructor(dataSource: DataSource) {
    super(Properties, dataSource);
  }

  override globalQuery(
    query: SelectQueryBuilder<Properties>,
  ): SelectQueryBuilder<Properties> {
    const currentUserId = RequestContextService.getUserId();
    console.log(
      '💞💓💗💞💓💗 ~ PropertiesRepository ~ globalQuery ~ currentUserId:',
      currentUserId,
    );
    query.andWhere(`${query.alias}.ownerId = :currentUserId`, {
      currentUserId,
    });
    return query;
  }
}
