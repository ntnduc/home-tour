import { Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ContractProperties } from '../entities/contract-properties.entity';

@Injectable()
export class ContractPropertiesRepository extends BaseRepository<ContractProperties> {
  constructor(dataSource: DataSource) {
    super(ContractProperties, dataSource);
  }

  override globalQuery(
    query: SelectQueryBuilder<ContractProperties>,
  ): SelectQueryBuilder<ContractProperties> {
    // Không cần filter đặc biệt cho contract properties
    return query;
  }

  async findByContractId(contractId: string): Promise<ContractProperties[]> {
    return this.createQueryBuilder('contractProperty')
      .leftJoinAndSelect('contractProperty.property', 'property')
      .where('contractProperty.contractId = :contractId', { contractId })
      .orderBy('contractProperty.createdAt', 'ASC')
      .getMany();
  }

  async findActivePropertiesByContractId(
    contractId: string,
  ): Promise<ContractProperties[]> {
    return this.createQueryBuilder('contractProperty')
      .leftJoinAndSelect('contractProperty.property', 'property')
      .where('contractProperty.contractId = :contractId', { contractId })
      .andWhere('contractProperty.isActiveInContract = :isActive', { isActive: true })
      .orderBy('contractProperty.createdAt', 'ASC')
      .getMany();
  }

  async findByPropertyUserId(
    propertyUserId: string,
  ): Promise<ContractProperties[]> {
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
