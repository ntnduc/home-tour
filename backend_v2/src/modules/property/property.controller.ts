import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @Get('combo')
  @ApiOperation({ summary: 'Get combo property' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Entity already exists.' })
  async getComboProperty() {
    return await this.propertyService.getComboProperty();
  }
}
