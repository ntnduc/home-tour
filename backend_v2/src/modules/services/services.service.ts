import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService } from './../../common/base/crud/base.service';
import { BaseFilterDto } from './../../common/base/dto/filter.dto';
import { removeAccents } from './../../common/utils';
import { CreateServiceDto } from './dto/services.create.dto';
import { ServiceDetailDto } from './dto/services.detail.dto';
import { ServiceListDto } from './dto/services.list.dto';
import { UpdateServiceDto } from './dto/services.update.dto';
import { Services } from './entities/services.entity';
import { ServicesRepository } from './repositories/services.repository';

@Injectable()
export class ServicesService extends BaseService<
  Services,
  ServiceDetailDto,
  ServiceListDto,
  CreateServiceDto,
  UpdateServiceDto
> {
  constructor(private readonly serviceRepository: ServicesRepository) {
    super(
      serviceRepository,
      ServiceDetailDto,
      ServiceListDto,
      CreateServiceDto,
      UpdateServiceDto,
    );
  }

  async getDefaultSelected() {
    const services = await this.serviceRepository.find({
      where: {
        isDefaultSelected: true,
      },
    });
    const result = services.map((service) => {
      const detailDto = new ServiceDetailDto();
      detailDto.fromEntity(service);
      return detailDto;
    });
    return result;
  }

  override async applyFilter(
    query: SelectQueryBuilder<Services>,
    filter: BaseFilterDto<Services>,
  ) {
    const { globalKey } = filter;
    if (globalKey) {
      const slugKey = removeAccents(globalKey);
      query.andWhere('entity.name_slug ILIKE :slugKey', {
        slugKey: `%${slugKey}%`,
      });
    }
    query.andWhere('entity.isActive = :isActive', {
      isActive: true,
    });
    query.andWhere('entity.isDefaultSelected = :isDefaultSelected', {
      isDefaultSelected: true,
    });
    return { query, filter };
  }
}
