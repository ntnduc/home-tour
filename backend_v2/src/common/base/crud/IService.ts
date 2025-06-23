export interface IBaseService<
  TEntity,
  TDetailDto,
  TListDto,
  TCreateDto,
  TUpdateDto,
> {
  getAll(): Promise<TListDto[]>;
  get(id: string): Promise<TDetailDto>;
  update(entity: TUpdateDto): Promise<TDetailDto>;
  create(entity: TCreateDto): Promise<TDetailDto>;
  delete(id: string): Promise<void>;
}
