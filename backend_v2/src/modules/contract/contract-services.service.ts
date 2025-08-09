import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PropertiesServiceRepository } from '../property/repositories/properties-service.repository';
import { ServicesRepository } from '../services/repositories/services.repository';
import { ContractServiceCreateDto } from './dto/contract-services-dto/contract-service.create.dto';
import { ContractServiceUpdateDto } from './dto/contract-services-dto/contract-service.update.dto';
import { ContractServices } from './entities/contract-services.entity';
import { ContractServicesRepository } from './repositories/contract-services.repository';
import { ContractsRepository } from './repositories/contracts.repository';

@Injectable()
export class ContractServicesService {
  constructor(
    private readonly contractServicesRepository: ContractServicesRepository,
    private readonly contractsRepository: ContractsRepository,
    private readonly servicesRepository: ServicesRepository,
    private readonly propertiesServiceRepository: PropertiesServiceRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: ContractServiceCreateDto): Promise<ContractServices> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Kiểm tra hợp đồng tồn tại
      const contract = await this.contractsRepository.findOne({
        where: { id: createDto.contractId },
      });

      if (!contract) {
        throw new NotFoundException('Hợp đồng không tồn tại');
      }

      // Kiểm tra dịch vụ chưa được thêm vào hợp đồng này
      const existingService =
        await this.contractServicesRepository.findByContractIdAndServiceId(
          createDto.contractId!,
          createDto.serviceId,
        );

      if (existingService) {
        throw new BadRequestException('Dịch vụ đã được thêm vào hợp đồng này');
      }

      let serviceEntity: ContractServices;

      if (createDto.propertyServiceId) {
        // Trường hợp 1: Clone từ property service
        const propertyService = await this.propertiesServiceRepository.findOne({
          where: { id: createDto.propertyServiceId },
          relations: ['service'],
        });

        if (!propertyService) {
          throw new NotFoundException('Dịch vụ property không tồn tại');
        }

        serviceEntity = new ContractServices();
        serviceEntity.contractId = createDto.contractId!;
        serviceEntity.serviceId = propertyService.serviceId;
        serviceEntity.customPrice =
          createDto.customPrice || propertyService.price;
        serviceEntity.isEnabled = createDto.isEnabled ?? true;
        serviceEntity.notes = createDto.notes;
      } else {
        // Trường hợp 2: Tạo mới hoàn toàn
        // Kiểm tra service tồn tại
        const service = await this.servicesRepository.findOne({
          where: { id: createDto.serviceId },
        });

        if (!service) {
          throw new NotFoundException('Dịch vụ không tồn tại');
        }

        serviceEntity = createDto.getEntity();
      }

      const savedService = await queryRunner.manager.save(
        ContractServices,
        serviceEntity,
      );
      await queryRunner.commitTransaction();

      const result = await this.contractServicesRepository.findOne({
        where: { id: savedService.id },
        relations: ['service'],
      });

      if (!result) {
        throw new NotFoundException(
          'Dịch vụ hợp đồng không tồn tại sau khi tạo',
        );
      }

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    updateDto: ContractServiceUpdateDto,
  ): Promise<ContractServices> {
    const existingService = await this.contractServicesRepository.findOne({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundException('Dịch vụ hợp đồng không tồn tại');
    }

    const updateData = updateDto.getEntity(existingService);
    await this.contractServicesRepository.update({ id }, updateData);

    const result = await this.contractServicesRepository.findOne({
      where: { id },
      relations: ['service'],
    });

    if (!result) {
      throw new NotFoundException(
        'Dịch vụ hợp đồng không tồn tại sau khi cập nhật',
      );
    }

    return result;
  }

  async findByContractId(contractId: string): Promise<ContractServices[]> {
    return await this.contractServicesRepository.findByContractId(contractId);
  }

  async findEnabledServicesByContractId(
    contractId: string,
  ): Promise<ContractServices[]> {
    return await this.contractServicesRepository.findEnabledServicesByContractId(
      contractId,
    );
  }

  async findByContractIdAndServiceId(
    contractId: string,
    serviceId: string,
  ): Promise<ContractServices | null> {
    return await this.contractServicesRepository.findByContractIdAndServiceId(
      contractId,
      serviceId,
    );
  }

  async remove(id: string): Promise<void> {
    const service = await this.contractServicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Dịch vụ hợp đồng không tồn tại');
    }

    await this.contractServicesRepository.delete({ id });
  }

  async toggleService(
    id: string,
    isEnabled: boolean,
  ): Promise<ContractServices> {
    const service = await this.contractServicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Dịch vụ hợp đồng không tồn tại');
    }

    await this.contractServicesRepository.update({ id }, { isEnabled });

    const result = await this.contractServicesRepository.findOne({
      where: { id },
      relations: ['service'],
    });

    if (!result) {
      throw new NotFoundException(
        'Dịch vụ hợp đồng không tồn tại sau khi cập nhật',
      );
    }

    return result;
  }

  async updatePrice(
    id: string,
    customPrice: number,
  ): Promise<ContractServices> {
    const service = await this.contractServicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Dịch vụ hợp đồng không tồn tại');
    }

    await this.contractServicesRepository.update({ id }, { customPrice });

    const result = await this.contractServicesRepository.findOne({
      where: { id },
      relations: ['service'],
    });

    if (!result) {
      throw new NotFoundException(
        'Dịch vụ hợp đồng không tồn tại sau khi cập nhật',
      );
    }

    return result;
  }

  /**
   * Clone tất cả dịch vụ từ property sang contract
   */
  async cloneFromPropertyServices(
    contractId: string,
    propertyId: string,
  ): Promise<ContractServices[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lấy tất cả dịch vụ của property
      const propertyServices = await this.propertiesServiceRepository.find({
        where: { propertyId },
        relations: ['service'],
      });

      const createdServices: ContractServices[] = [];

      for (const propertyService of propertyServices) {
        // Kiểm tra dịch vụ chưa tồn tại trong contract
        const existingService =
          await this.contractServicesRepository.findByContractIdAndServiceId(
            contractId,
            propertyService.serviceId,
          );

        if (!existingService) {
          const contractService = new ContractServices();
          contractService.contractId = contractId;
          contractService.serviceId = propertyService.serviceId;
          contractService.customPrice = propertyService.price;
          contractService.isEnabled = true; // Default enabled when cloning
          contractService.notes = `Cloned from property service: ${propertyService.service?.name}`;

          const savedService = await queryRunner.manager.save(
            ContractServices,
            contractService,
          );
          createdServices.push(savedService);
        }
      }

      await queryRunner.commitTransaction();

      // Lấy lại thông tin chi tiết
      const result: ContractServices[] = [];
      for (const service of createdServices) {
        const detailService = await this.contractServicesRepository.findOne({
          where: { id: service.id },
          relations: ['service'],
        });
        if (detailService) {
          result.push(detailService);
        }
      }

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
