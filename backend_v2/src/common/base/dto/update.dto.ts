import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from '../Entity/BaseEntity';

export abstract class BaseUpdateDto<TEntity extends BaseEntity> {
  id: string;
  abstract getEntity(entity: TEntity): QueryDeepPartialEntity<TEntity>;
}
