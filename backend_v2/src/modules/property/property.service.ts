import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { IBaseService } from 'src/common/base/crud/IService';
import { Repository } from 'typeorm';
import { PropertyCreateDto } from './dto/property.create.dto';
import { PropertyDetailDto } from './dto/property.detail.dto';
import { Properties } from './entities/properties.entity';

@Injectable()
export class PropertyService
  extends BaseService<Properties, PropertyDetailDto, PropertyCreateDto>
  implements IBaseService<Properties, PropertyDetailDto, PropertyCreateDto>
{
  constructor(
    @InjectRepository(Properties)
    private propertiesRepository: Repository<Properties>,
  ) {
    super(propertiesRepository, PropertyDetailDto, PropertyCreateDto);
  }
}
