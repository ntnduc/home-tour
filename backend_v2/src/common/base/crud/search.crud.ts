import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PagedFilter<TFilter = any, TSort = any> {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (Number(value) === -1) return undefined;
    return value ? Number(value) : undefined;
  })
  limit = 10;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return value ? Number(value) : undefined;
  })
  offset = 0;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return value ? value : undefined;
  })
  globalKey?: string;

  @ApiProperty()
  @IsOptional()
  filters?: TFilter;

  @ApiProperty()
  @IsOptional()
  sort?: TSort;
}

export class PaginateResult<TDto> {
  offset: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Array<TDto>;

  constructor(
    items: TDto[],
    totalCount: number,
    limit: number,
    offset: number,
  ) {
    this.items = items;
    this.total = totalCount;
    this.limit = limit;
    this.offset = offset;
    this.totalPages = Math.ceil(totalCount / limit);
  }
}
