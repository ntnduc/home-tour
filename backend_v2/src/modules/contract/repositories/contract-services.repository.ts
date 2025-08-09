import { Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ContractServices } from '../entities/contract-services.entity';

@Injectable()
export class ContractServicesRepository extends BaseRepository<ContractServices> {
  constructor(dataSource: DataSource) {
    super(ContractServices, dataSource);
  }

  override globalQuery(
    query: SelectQueryBuilder<ContractServices>,
  ): SelectQueryBuilder<ContractServices> {
    // Không cần filter đặc biệt cho contract services
    return query;
  }

  async findByContractId(contractId: string): Promise<ContractServices[]> {
    return this.createQueryBuilder('contractService')
      .leftJoinAndSelect('contractService.service', 'service')
      .where('contractService.contractId = :contractId', { contractId })
      .orderBy('service.name', 'ASC')
      .getMany();
  }

  async findEnabledServicesByContractId(
    contractId: string,
  ): Promise<ContractServices[]> {
    return this.createQueryBuilder('contractService')
      .leftJoinAndSelect('contractService.service', 'service')
      .where('contractService.contractId = :contractId', { contractId })
      .andWhere('contractService.isEnabled = :isEnabled', { isEnabled: true })
      .orderBy('service.name', 'ASC')
      .getMany();
  }

  async findByContractIdAndServiceId(
    contractId: string,
    serviceId: string,
  ): Promise<ContractServices | null> {
    return this.createQueryBuilder('contractService')
      .leftJoinAndSelect('contractService.service', 'service')
      .where('contractService.contractId = :contractId', { contractId })
      .andWhere('contractService.serviceId = :serviceId', { serviceId })
      .getOne();
  }
}
