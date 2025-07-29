import { BaseService } from 'src/common/base/crud/base.service';

import { Injectable } from '@nestjs/common';
import { CreatePropertyServiceDto } from './dto/properties-service-dto/properties-service.create.dto';
import { PropertyServiceDetailDto } from './dto/properties-service-dto/properties-service.detail.dto';
import { PropertyServiceListDto } from './dto/properties-service-dto/properties-service.list.dto';
import { UpdatePropertyServiceDto } from './dto/properties-service-dto/properties-service.update.dto';
import { PropertiesService } from './entities/properties-service.entity';
import { PropertiesServiceRepository } from './repositories/properties-service.repository';

@Injectable()
export class PropertiesServiceService extends BaseService<
  PropertiesService,
  PropertyServiceDetailDto,
  PropertyServiceListDto,
  CreatePropertyServiceDto,
  UpdatePropertyServiceDto
> {
  constructor(
    private readonly propertiesServiceRepository: PropertiesServiceRepository,
  ) {
    super(
      propertiesServiceRepository,
      PropertyServiceDetailDto,
      PropertyServiceListDto,
      CreatePropertyServiceDto,
      UpdatePropertyServiceDto,
    );
  }
}
