import { BaseFilterDto } from '../dto/filter.dto';
import { PaginateResult } from './search.crud';

export interface IBaseService<
  TEntity,
  TDetailDto,
  TListDto,
  TCreateDto,
  TUpdateDto,
> {
  getAll(filter: BaseFilterDto<TEntity>): Promise<PaginateResult<TListDto>>;
  get(id: string): Promise<TDetailDto>;
  update(entity: TUpdateDto): Promise<TDetailDto>;
  create(entity: TCreateDto): Promise<TDetailDto>;
  delete(id: string): Promise<void>;
}
