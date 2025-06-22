import { Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { IBaseService } from './IService';

export class BaseController<
  TService extends IBaseService<TEntity, TDetailDto, TCreateDto>,
  TEntity,
  TDetailDto,
  TCreateDto,
> {
  constructor(
    protected readonly service: TService,
    protected readonly createDto: new () => TCreateDto,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Entity already exists.' })
  create(@Body() dto: TCreateDto) {
    const createdDto = plainToInstance(this.createDto, dto);
    console.log('💞💓💗💞💓💗 ~ create ~ createdDto:', createdDto);
    return this.service.create(createdDto);
  }
}
