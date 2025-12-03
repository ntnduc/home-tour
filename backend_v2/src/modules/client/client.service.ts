import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../../common/base/crud/base.service';
import { IBaseService } from '../../common/base/crud/IService';
import { ClientCreateDto } from './dto/client.create.dto';
import { ClientDetailDto } from './dto/client.detail.dto';
import { ClientListDto } from './dto/client.list.dto';
import { ClientUpdateDto } from './dto/client.update.dto';
import { Client } from './entities/client.entity';
import { ClientRepository } from './repositories/client.repository';

@Injectable()
export class ClientService
  extends BaseService<
    Client,
    ClientDetailDto,
    ClientListDto,
    ClientCreateDto,
    ClientUpdateDto
  >
  implements
    IBaseService<
      Client,
      ClientDetailDto,
      ClientListDto,
      ClientCreateDto,
      ClientUpdateDto
    >
{
  constructor(private readonly clientRepository: ClientRepository) {
    super(
      clientRepository,
      ClientDetailDto,
      ClientListDto,
      ClientCreateDto,
      ClientUpdateDto,
    );
  }

  async specQuery(): Promise<SelectQueryBuilder<Client>> {
    const query = this.clientRepository.createQueryBuilder('client');
    return query;
  }
}

