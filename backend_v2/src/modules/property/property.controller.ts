import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { BaseController } from 'src/common/base/crud/base.controller';
import { PropertyCreateDto } from './dto/properties-dto/property.create.dto';
import { PropertyDetailDto } from './dto/properties-dto/property.detail.dto';
import { PropertyListDto } from './dto/properties-dto/property.list.dto';
import { PropertyUpdateDto } from './dto/properties-dto/property.update.dto';
import { Properties } from './entities/properties.entity';
import { PropertyService } from './property.service';

@ApiTags('property')
@Controller('api/property')
export class PropertyController extends BaseController<
  PropertyService,
  Properties,
  PropertyDetailDto,
  PropertyListDto,
  PropertyCreateDto,
  PropertyUpdateDto
> {
  constructor(private readonly propertyService: PropertyService) {
    super(
      propertyService,
      PropertyDetailDto,
      PropertyListDto,
      PropertyCreateDto,
      PropertyUpdateDto,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Entity already exists.' })
  async create(@Request() request: Request, @Body() dto: PropertyCreateDto) {
    const createdDto = plainToInstance(PropertyCreateDto, dto);
    const currentUser = (request as any).user;
    createdDto.ownerId = currentUser.userId;
    return await super.create(request, createdDto);
  }
}
