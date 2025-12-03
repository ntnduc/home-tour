import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from '../Entity/base.entity';

export abstract class BaseUpdateDto<TEntity extends BaseEntity> {
  @ApiProperty()
  @IsString()
  id: string;
  abstract getEntity(entity: TEntity): QueryDeepPartialEntity<TEntity>;
}
