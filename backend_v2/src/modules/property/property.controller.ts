import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PropertyService } from './property.service';

@ApiTags('property')
@Controller('api/property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
}
