import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Properties } from './entities/properties.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Properties)
    private propertiesRepository: Repository<Properties>,
  ) {}
}
