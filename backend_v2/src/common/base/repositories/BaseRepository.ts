import {
  DataSource,
  EntityTarget,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseEntity } from '../Entity/BaseEntity';

export class BaseRepository<T extends BaseEntity> extends Repository<T> {
  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  globalQuery(query: SelectQueryBuilder<T>) {
    return query;
  }
}
