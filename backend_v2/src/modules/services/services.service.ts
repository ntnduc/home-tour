import { InjectRepository } from '@nestjs/typeorm';
import { BaseFilterDto } from 'src/common/base/dto/filter.dto';
import { removeAccents } from 'src/common/utils';
import { Repository, SelectQueryBuilder } from 'typeorm';
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

  override async applyFilter(
    query: SelectQueryBuilder<Services>,
    filter: BaseFilterDto<Services>,
  ) {
    const { globalKey } = filter;
    if (globalKey) {
      const slugKey = removeAccents(globalKey);
      query.andWhere('entity.name_slug ILIKE :slugKey', {
        globalKey: `%${slugKey}%`,
      });
    }
    return { query, filter };
  }
}
