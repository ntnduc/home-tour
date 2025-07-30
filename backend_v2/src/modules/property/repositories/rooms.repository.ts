import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { Rooms } from '../entities/rooms.entity';

@Injectable()
export class RoomsRepository extends BaseRepository<Rooms> {
  constructor(dataSource: DataSource) {
    super(Rooms, dataSource);
  }
}
