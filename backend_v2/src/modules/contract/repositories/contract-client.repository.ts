import { Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ContractClient } from '../entities/contract-client.entity';

@Injectable()
export class ContractClientRepository extends BaseRepository<ContractClient> {
  constructor(dataSource: DataSource) {
    super(ContractClient, dataSource);
  }

  override globalQuery(
    query: SelectQueryBuilder<ContractClient>,
  ): SelectQueryBuilder<ContractClient> {
    // Không cần filter đặc biệt cho contract properties
    return query;
  }

  async findByContractId(contractId: string): Promise<ContractClient[]> {
    return this.createQueryBuilder('contractProperty')
      .leftJoinAndSelect('contractProperty.property', 'property')
      .where('contractProperty.contractId = :contractId', { contractId })
      .orderBy('contractProperty.createdAt', 'ASC')
      .getMany();
  }

  async findActivePropertiesByContractId(
    contractId: string,
  ): Promise<ContractClient[]> {
    return this.createQueryBuilder('contractProperty')
      .leftJoinAndSelect('contractProperty.property', 'property')
      .where('contractProperty.contractId = :contractId', { contractId })
      .andWhere('contractProperty.isActiveInContract = :isActive', {
        isActive: true,
      })
      .orderBy('contractProperty.createdAt', 'ASC')
      .getMany();
  }

  async findByPropertyUserId(
    propertyUserId: string,
  ): Promise<ContractClient[]> {
    return this.createQueryBuilder('contractProperty')
      .leftJoinAndSelect('contractProperty.contract', 'contract')
      .leftJoinAndSelect('contract.room', 'room')
      .leftJoinAndSelect('room.property', 'property')
      .where('contractProperty.propertyUserId = :propertyUserId', {
        propertyUserId,
      })
      .orderBy('contractProperty.createdAt', 'DESC')
      .getMany();
  }
}
