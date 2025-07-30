import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { isMethodOverridden } from '../../utils';
import { BaseCreateDto } from '../dto/create.dto';
import { BaseDetailDto } from '../dto/detail.dto';
import { BaseFilterDto } from '../dto/filter.dto';
import { BaseListDto } from '../dto/list.dto';
import { BaseUpdateDto } from '../dto/update.dto';
import { BaseEntity } from '../Entity/base.entity';
import { BaseRepository } from '../repositories/base.repository';
import { IBaseService } from './IService';
import { PaginateResult } from './search.crud';

@Injectable()
export class BaseService<
  TEntity extends BaseEntity,
  TDetailDto extends BaseDetailDto<TEntity>,
  TListDto extends BaseListDto<TEntity>,
  TCreateDto extends BaseCreateDto<TEntity>,
  TUpdateDto extends BaseUpdateDto<TEntity>,
> implements IBaseService<TEntity, TDetailDto, TListDto, TCreateDto, TUpdateDto>
{
  constructor(
    protected readonly genericRepository: BaseRepository<TEntity>,
    protected readonly detailDto: new () => TDetailDto,
    protected readonly listDto: new () => TListDto,
    protected readonly createDto: new () => TCreateDto,
    protected readonly updateDto: new () => TUpdateDto,
  ) {}

  async specQuery(): Promise<SelectQueryBuilder<TEntity>> {
    const query = this.genericRepository.createQueryBuilder('entity');
    return query;
  }

  async beautifyResult(items: TEntity[]): Promise<TListDto[]> {
    return items.map((item) => {
      const listDto = new this.listDto();
      listDto.fromEntity(item);
      return listDto as TListDto;
    });
  }

  async applyFilter(
    query: SelectQueryBuilder<TEntity>,
    filter: BaseFilterDto<TEntity>,
  ) {
    return { query, filter };
  }

  async getAll(
    filter: BaseFilterDto<TEntity>,
  ): Promise<PaginateResult<TListDto>> {
    const { globalKey, filter: filterDto, sort, limit, offset } = filter;
    let query = await this.specQuery();

    query.skip(offset);
    query.take(limit);

    const isApplyFilterOverridden = isMethodOverridden(
      this,
      'applyFilter',
      BaseService,
    );

    if (isApplyFilterOverridden) {
      ({ query, filter } = await this.applyFilter(query, filter));
    } else {
      if (globalKey) {
        query.andWhere('entity.name ILIKE :globalKey', {
          globalKey: `%${globalKey}%`,
        });
      }
    }

    if (filterDto) {
      Object.keys(filterDto).forEach((key) => {
        query.andWhere(`entity.${key} = :${key}`, { [key]: filterDto[key] });
      });
    }

    if (sort) {
      Object.keys(sort).forEach((key) => {
        query.orderBy(`entity.${key}`, sort[key]);
      });
    }

    const [items, total] = await query.getManyAndCount();
    const listDto = await this.beautifyResult(items);
    return new PaginateResult(listDto, total, limit, offset);
  }

  async get(id: string): Promise<TDetailDto> {
    const entity = await this.genericRepository.findOne({
      where: {
        id: id as any,
      },
    });

    if (!entity) {
      throw new NotFoundException('Không tìm thấy dữ liệu!');
    }
    const detailDto = new this.detailDto();
    detailDto.fromEntity(entity);
    return detailDto;
  }

  async update(dto: TUpdateDto): Promise<TDetailDto> {
    const entity = await this.genericRepository.findOne({
      where: {
        id: dto.id as any,
      },
    });
    if (!entity) {
      throw new NotFoundException('Không tìm thấy dữ liệu!');
    }
    const updatedEntity = dto.getEntity(entity);
    const newEntity = await this.genericRepository.update(
      entity.id,
      updatedEntity,
    );
    const result = new this.detailDto();
    result.fromEntity(newEntity.raw);
    return result;
  }

  delete(id: string): Promise<void> {
    this.genericRepository.delete(id);
    return Promise.resolve();
  }

  async create(dto: TCreateDto): Promise<TDetailDto> {
    try {
      const entity = dto.getEntity();
      const createdEntity = await this.genericRepository.save(entity);
      const detailDto = new this.detailDto();
      detailDto.fromEntity(createdEntity);
      return detailDto;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
