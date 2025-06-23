import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { IBaseService } from './IService';

export class BaseController<
  TService extends IBaseService<
    TEntity,
    TDetailDto,
    TListDto,
    TCreateDto,
    TUpdateDto
  >,
  TEntity,
  TDetailDto,
  TListDto,
  TCreateDto,
  TUpdateDto,
> {
  constructor(
    protected readonly service: TService,
    protected readonly detailDto: new () => TDetailDto,
    protected readonly listDto: new () => TListDto,
    protected readonly createDto: new () => TCreateDto,
    protected readonly updateDto: new () => TUpdateDto,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Entity already exists.' })
  async create(@Body() dto: TCreateDto) {
    const createdDto = plainToInstance(this.createDto, dto);
    return await this.service.create(createdDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({ status: 200, description: 'List of entities.' })
  async getAll() {
    return await this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single entity' })
  @ApiResponse({ status: 200, description: 'Entity found.' })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  async get(@Param('id') id: string) {
    return await this.service.get(id);
  }

  @Put()
  @ApiOperation({ summary: 'Update an entity' })
  @ApiResponse({ status: 200, description: 'Entity updated.' })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  async update(@Body() dto: TUpdateDto) {
    const updatedDto = plainToInstance(this.updateDto, dto);
    return await this.service.update(updatedDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an entity' })
  @ApiResponse({ status: 200, description: 'Entity deleted.' })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
