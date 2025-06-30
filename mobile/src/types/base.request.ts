export interface BasePagingRequest<TFilter = any> {
  limit: number;
  offset: number;
  filters?: TFilter;
  globalKey?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
