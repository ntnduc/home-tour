export interface BasePagingRequest<TFilter = any> {
  limit: number;
  offset: number;
  filters?: TFilter;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
