import {
  DataSource,
  EntityTarget,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseEntity } from '../Entity/BaseEntity';

export abstract class BaseRepository<
  T extends BaseEntity,
> extends Repository<T> {
  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  globalQuery(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    return query;
  }

  override createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    const query = super.createQueryBuilder(alias, queryRunner);

    const applyGlobalQuery = this.globalQuery(query);
    return applyGlobalQuery;
  }

  override findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.createQueryBuilder()
      .setFindOptions({
        ...options,
        take: 1,
      })
      .getOne();
  }

  override findOneBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<T | null> {
    return this.createQueryBuilder()
      .setFindOptions({
        where,
        take: 1,
      })
      .getOne();
  }
}
