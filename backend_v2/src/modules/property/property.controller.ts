import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/crud/base.controller';
import { PropertyCreateDto } from './dto/property.create.dto';
import { PropertyDetailDto } from './dto/property.detail.dto';
import { PropertyListDto } from './dto/property.list.dto';
import { PropertyUpdateDto } from './dto/property.update.dto';
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
}
