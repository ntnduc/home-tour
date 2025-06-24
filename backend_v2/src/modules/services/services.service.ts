import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from './../../common/base/crud/base.service';
import { CreateServiceDto } from './dto/services.create.dto';
import { ServiceDetailDto } from './dto/services.detail.dto';
import { ServiceListDto } from './dto/services.list.dto';
import { UpdateServiceDto } from './dto/services.update.dto';
import { Services } from './entities/services.entity';

export class ServicesService extends BaseService<
  Services,
  ServiceDetailDto,
  ServiceListDto,
  CreateServiceDto,
  UpdateServiceDto
> {
  constructor(
    @InjectRepository(Services)
    private readonly serviceRepository: Repository<Services>,
  ) {
    super(
      serviceRepository,
      ServiceDetailDto,
      ServiceListDto,
      CreateServiceDto,
      UpdateServiceDto,
    );
  }
}
