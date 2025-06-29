export interface BasePagingResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
  offset: number;
  limit: number;
}
