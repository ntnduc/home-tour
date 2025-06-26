import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { Repository } from 'typeorm';

import { CreatePropertyServiceDto } from './dto/properties-service-dto/properties-service.create.dto';
import { PropertyServiceDetailDto } from './dto/properties-service-dto/properties-service.detail.dto';
import { PropertyServiceListDto } from './dto/properties-service-dto/properties-service.list.dto';
import { UpdatePropertyServiceDto } from './dto/properties-service-dto/properties-service.update.dto';
import { PropertiesService } from './entities/properties-service.entity';

export class PropertiesServiceService extends BaseService<
  PropertiesService,
  PropertyServiceDetailDto,
  PropertyServiceListDto,
  CreatePropertyServiceDto,
  UpdatePropertyServiceDto
> {
  constructor(
    @InjectRepository(PropertiesService)
    private readonly propertiesServiceRepository: Repository<PropertiesService>,
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
