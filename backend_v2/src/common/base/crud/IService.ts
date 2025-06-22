export interface IBaseService<TEntity, TDetailDto, TCreateDto> {
  // getAll(): Promise<T[]>;
  // get(id: number): Promise<T>;
  // update(entity: T): Promise<T>;
  create(entity: TCreateDto): Promise<TDetailDto>;
  // delete(id: number);
}
