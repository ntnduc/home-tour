import { Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { RequestContextService } from '../../../common/base/context/request-context.service';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { Contracts } from '../entities/contracts.entity';

@Injectable()
export class ContractsRepository extends BaseRepository<Contracts> {
  constructor(dataSource: DataSource) {
    super(Contracts, dataSource);
  }

  override globalQuery(
    query: SelectQueryBuilder<Contracts>,
  ): SelectQueryBuilder<Contracts> {
    const currentUserId = RequestContextService.getUserId();

    // Chỉ hiển thị hợp đồng mà user là chủ nhà hoặc người thuê chính
    query.andWhere(
      `(${query.alias}.landlordUserId = :currentUserId OR ${query.alias}.primaryTenantUserId = :currentUserId)`,
      { currentUserId },
    );

    return query;
  }

  async findWithRelations(id: string): Promise<Contracts | null> {
    return this.createQueryBuilder('contract')
      .leftJoinAndSelect('contract.property', 'property')
      .leftJoinAndSelect('contract.room', 'room')
      .leftJoinAndSelect('room.property', 'roomProperty')
      .leftJoinAndSelect('contract.primaryTenant', 'primaryTenant')
      .leftJoinAndSelect('contract.landlord', 'landlord')
      .leftJoinAndSelect('contract.contractProperties', 'contractProperties')
      .leftJoinAndSelect('contractProperties.property', 'contractProperty')
      .leftJoinAndSelect('contract.contractServices', 'contractServices')
      .leftJoinAndSelect('contractServices.service', 'service')
      .where('contract.id = :id', { id })
      .getOne();
  }

  async findByRoomId(roomId: string): Promise<Contracts[]> {
    return this.createQueryBuilder('contract')
      .leftJoinAndSelect('contract.primaryTenant', 'primaryTenant')
      .leftJoinAndSelect('contract.landlord', 'landlord')
      .where('contract.roomId = :roomId', { roomId })
      .orderBy('contract.createdAt', 'DESC')
      .getMany();
  }

  async findActiveContractByRoomId(roomId: string): Promise<Contracts | null> {
    return this.createQueryBuilder('contract')
      .leftJoinAndSelect('contract.primaryTenant', 'primaryTenant')
      .leftJoinAndSelect('contract.landlord', 'landlord')
      .leftJoinAndSelect('contract.contractProperties', 'contractProperties')
      .leftJoinAndSelect('contractProperties.property', 'contractProperty')
      .where('contract.roomId = :roomId', { roomId })
      .andWhere('contract.status = :status', { status: 'ACTIVE' })
      .getOne();
  }
}
