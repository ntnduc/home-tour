import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/crud/base.controller';
import { CreateServiceDto } from './dto/services.create.dto';
import { ServiceDetailDto } from './dto/services.detail.dto';
import { ServiceListDto } from './dto/services.list.dto';
import { UpdateServiceDto } from './dto/services.update.dto';
import { Services } from './entities/services.entity';
import { ServicesService } from './services.service';

@ApiTags('Services')
@Controller('api/services')
export class ServicesController extends BaseController<
  ServicesService,
  Services,
  ServiceDetailDto,
  ServiceListDto,
  CreateServiceDto,
  UpdateServiceDto
> {
  constructor(private readonly serviceService: ServicesService) {
    super(
      serviceService,
      ServiceDetailDto,
      ServiceListDto,
      CreateServiceDto,
      UpdateServiceDto,
    );
  }
}
