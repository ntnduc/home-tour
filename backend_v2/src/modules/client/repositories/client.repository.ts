import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientRepository extends BaseRepository<Client> {
  constructor(dataSource: DataSource) {
    super(Client, dataSource);
  }
}

