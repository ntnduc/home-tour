import { PagedFilter } from '../crud/search.crud';

export class BaseFilterDto<TEntity> extends PagedFilter<TEntity> {}
