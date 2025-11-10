import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus } from 'src/common/enums/contract.enum';
import { DataSource, EntityManager, In, SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../../common/base/crud/base.service';
import { IBaseService } from '../../common/base/crud/IService';
import { RoomStatus } from '../../common/enums/room.enum';
import { AuthService } from '../auth/auth.service';
import { Client } from '../client/entities/client.entity';
import { ClientRepository } from '../client/repositories/client.repository';
import { PropertiesService } from '../property/entities/properties-service.entity';
import { PropertiesServiceRepository } from '../property/repositories/properties-service.repository';
import { RoomsRepository } from '../property/repositories/rooms.repository';
import { ServiceDetailDto } from '../services/dto/services.detail.dto';
import { Services } from '../services/entities/services.entity';
import { ServicesRepository } from '../services/repositories/services.repository';
import { UserRepository } from '../users/repositories/user.repository';
import { ContractClientCreateDto } from './dto/contract-client-dto/contract-client.create.dto';
import { ContractCreateDto } from './dto/contract-dto/contract.create.dto';
import { ContractDetailDto } from './dto/contract-dto/contract.detail.dto';
import { ContractListDto } from './dto/contract-dto/contract.list.dto';
import { ContractUpdateDto } from './dto/contract-dto/contract.update.dto';
import { ContractServiceCreateDto } from './dto/contract-services-dto/contract-service.create.dto';
import { Contracts } from './entities/contracts.entity';
import { ContractsRepository } from './repositories/contracts.repository';

@Injectable()
export class ContractService
  extends BaseService<
    Contracts,
    ContractDetailDto,
    ContractListDto,
    ContractCreateDto,
    ContractUpdateDto
  >
  implements
    IBaseService<
      Contracts,
      ContractDetailDto,
      ContractListDto,
      ContractCreateDto,
      ContractUpdateDto
    >
{
  constructor(
    private readonly contractsRepository: ContractsRepository,
    private readonly roomsRepository: RoomsRepository,
    private readonly propertiesServiceRepository: PropertiesServiceRepository,
    private readonly servicesRepository: ServicesRepository,
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly dataSource: DataSource,
  ) {
    super(
      contractsRepository,
      ContractDetailDto,
      ContractListDto,
      ContractCreateDto,
      ContractUpdateDto,
    );
  }

  async specQuery(): Promise<SelectQueryBuilder<Contracts>> {
    const query = this.contractsRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.property', 'property')
      .leftJoinAndSelect('contract.room', 'room')
      .leftJoinAndSelect('room.property', 'roomProperty')
      .leftJoinAndSelect('contract.contractClient', 'contractClient')
      .leftJoinAndSelect('contractClient.client', 'client')
      .leftJoinAndSelect('contract.contractProperties', 'contractProperties')
      .leftJoinAndSelect('contractProperties.property', 'contractProperty')
      .leftJoinAndSelect('contract.contractServices', 'contractServices')
      .leftJoinAndSelect('contractServices.propertyService', 'propertyService')
      .leftJoinAndSelect('propertyService.service', 'service');

    return query;
  }

  async create(createDto: ContractCreateDto): Promise<ContractDetailDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Kiểm tra phòng có tồn tại và trạng thái AVAILABLE
      const room = await this.roomsRepository.findOne({
        where: { id: createDto.roomId },
      });

      if (!room) {
        throw new NotFoundException('Phòng không tồn tại');
      }

      if (room.status !== RoomStatus.AVAILABLE) {
        throw new BadRequestException('Phòng đang không sẵn sàng để cho thuê!');
      }

      const activeContractExists = await this.contractsRepository.findOne({
        where: {
          roomId: createDto.roomId,
          status: ContractStatus.ACTIVE,
        },
      });

      if (activeContractExists) {
        throw new BadRequestException('Phòng đã có hợp đồng đang hoạt động');
      }

      const contractEntity = createDto.getEntity();
      if (contractEntity.startDate <= new Date()) {
        contractEntity.status = ContractStatus.ACTIVE;
      }
      const savedContract = await queryRunner.manager.save(
        Contracts,
        contractEntity,
      );

      if (createDto.contractClient && createDto.contractClient.length > 0) {
        await this.createContractClient(
          savedContract.id,
          createDto.contractClient,
          savedContract,
          queryRunner.manager,
        );
      } else {
        throw new BadRequestException('Phải có ít nhất 1 người thuê');
      }

      if (createDto.contractServices && createDto.contractServices.length > 0) {
        await this.createContractServices(
          savedContract.id,
          createDto.contractServices,
          savedContract,
          queryRunner.manager,
        );
      }

      if (savedContract.status === ContractStatus.ACTIVE) {
        await queryRunner.manager.update(
          'rooms',
          { id: createDto.roomId },
          { status: RoomStatus.OCCUPIED },
        );
      }

      await queryRunner.commitTransaction();

      const detailContract = await this.contractsRepository.findOne({
        where: { id: savedContract.id },
        relations: [
          'contractServices',
          'contractServices.propertyService',
          'contractServices.propertyService.service',
          'contractClient',
          'contractClient.client',
        ],
      });
      const detailDto = new ContractDetailDto();
      detailDto.fromEntity(detailContract!);
      return detailDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(updateDto: ContractUpdateDto): Promise<ContractDetailDto> {
    const id = updateDto.id;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingContract = await this.contractsRepository.findOne({
        where: { id },
        relations: ['room'],
      });

      if (!existingContract) {
        throw new NotFoundException('Hợp đồng không tồn tại');
      }

      const oldStatus = existingContract.status;
      const updateData = updateDto.getEntity(existingContract);

      await queryRunner.manager.update(Contracts, { id }, updateData);

      // Xử lý thay đổi trạng thái
      if (updateDto.status && updateDto.status !== oldStatus) {
        await this.handleStatusChange(
          existingContract,
          updateDto.status,
          queryRunner.manager,
        );
      }

      await queryRunner.commitTransaction();

      // Lấy thông tin chi tiết hợp đồng sau khi cập nhật
      const detailContract = await this.contractsRepository.findOne({
        where: { id },
        relations: [
          'contractServices',
          'contractServices.propertyService',
          'contractServices.propertyService.service',
        ],
      });
      const detailDto = new ContractDetailDto();
      detailDto.fromEntity(detailContract!);
      return detailDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async get(id: string): Promise<ContractDetailDto> {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: [
        'contractServices',
        'contractServices.propertyService',
        'contractServices.propertyService.service',
        'contractClient',
        'contractClient.client',
      ],
    });
    if (!contract) {
      throw new NotFoundException('Hợp đồng không tồn tại');
    }
    const detailDto = new ContractDetailDto();
    detailDto.fromEntity(contract);
    return detailDto;
  }

  // async findById(id: string): Promise<ContractDetailDto> {
  //   const contract = await this.contractsRepository.findWithRelations(id);
  //   if (!contract) {
  //     throw new NotFoundException('Hợp đồng không tồn tại');
  //   }

  //   const detailDto = new ContractDetailDto();
  //   detailDto.fromEntity(contract);
  //   return detailDto;
  // }

  // async findByRoomId(roomId: string): Promise<ContractListDto[]> {
  //   const contracts = await this.contractsRepository.findByRoomId(roomId);
  //   return this.beautifyResult(contracts);
  // }

  // async findActiveContractByRoomId(
  //   roomId: string,
  // ): Promise<ContractDetailDto | null> {
  //   const contract =
  //     await this.contractsRepository.findActiveContractByRoomId(roomId);
  //   if (!contract) {
  //     return null;
  //   }

  //   const detailDto = new ContractDetailDto();
  //   detailDto.fromEntity(contract);
  //   return detailDto;
  // }

  private async createContractServices(
    contractId: string,
    contractServicesDto: ContractServiceCreateDto[],
    contract: Contracts,
    manager: EntityManager,
  ): Promise<void> {
    for (const serviceDto of contractServicesDto) {
      if (serviceDto.propertyServiceId && !serviceDto.isNew) {
        const propertyService = await this.propertiesServiceRepository.findOne({
          where: { id: serviceDto.propertyServiceId },
          relations: ['service'],
        });

        if (propertyService) {
          const contractService = {
            contractId: contractId,
            propertyServiceId: propertyService.id,
            price: serviceDto.price ?? propertyService.price,
            isEnabled: serviceDto.isEnabled ?? true,
          };
          await manager.save('contract_services', contractService);
        }
      } else {
        const newService = new ServiceDetailDto();
        if (!serviceDto.isSelectedFromService) {
          const serviceEntity = new Services();
          serviceEntity.name = serviceDto.name ?? '';
          serviceEntity.isActive = true;
          serviceEntity.isDefaultSelected = true;
          serviceEntity.calculationMethod = serviceDto.calculationMethod;
          serviceEntity.price = serviceDto.price ?? 0;
          const service = await manager.save(serviceEntity);
          newService.fromEntity(service);
        } else {
          const service = await this.servicesRepository.findOne({
            where: { id: serviceDto.propertyServiceId, isActive: true },
          });

          if (!service) {
            throw new NotFoundException('Dịch vụ không tồn tại');
          }
          newService.fromEntity(service);
        }

        const newPropertyService = new PropertiesService();
        newPropertyService.propertyId = contract.propertyId ?? '';
        newPropertyService.serviceId = newService.id;
        newPropertyService.price = serviceDto.price ?? 0;
        newPropertyService.calculationMethod = serviceDto.calculationMethod;
        await manager.save(newPropertyService);

        serviceDto.propertyServiceId = newPropertyService.id;
        const newContractService = serviceDto.getEntity();
        await manager.save(newContractService);
      }
    }
  }

  private async createContractClient(
    contractId: string,
    contractClientsDto: ContractClientCreateDto[],
    contract: Contracts,
    manager: EntityManager,
  ): Promise<void> {
    const findPrimaryClient = contractClientsDto.find(
      (client) => client.isLandlordClient,
    );

    if (!findPrimaryClient) {
      throw new BadRequestException('Phải có ít nhất 1 người thuê chính');
    }

    contractClientsDto.forEach((property) => {
      if (property.isLandlordClient) {
        property.phone = AuthService.formatPhoneNumber(property.phone);
      }
    });

    const phones = contractClientsDto.map((x) => x.phone);

    const existedClients = await this.clientRepository.find({
      where: { phoneNumber: In(phones) },
    });

    for (const propertyDto of contractClientsDto) {
      const existed = existedClients.find(
        (x) => x.phoneNumber === propertyDto.phone,
      );

      if (existed) {
        propertyDto.clientId = existed.id;
      } else {
        const client = new Client();
        client.phoneNumber = propertyDto.phone;
        client.fullName = propertyDto.name;
        client.isActive = true;
        await manager.save(client);
        propertyDto.clientId = client.id;
      }
      propertyDto.contractId = contractId;
      const clientCreateDto = new ContractClientCreateDto();
      clientCreateDto.name = propertyDto.name;
      clientCreateDto.isLandlordClient = propertyDto.isLandlordClient;
      clientCreateDto.moveInDate = propertyDto.moveInDate;
      clientCreateDto.moveOutDate = propertyDto.moveOutDate;
      clientCreateDto.isActiveInContract = propertyDto.isActiveInContract;
      clientCreateDto.contractId = contractId;
      clientCreateDto.clientId = propertyDto.clientId;

      const clientEntity = clientCreateDto.getEntity();
      await manager.save(clientEntity);
    }
  }

  private async handleStatusChange(
    contract: Contracts,
    newStatus: ContractStatus,
    manager: EntityManager,
  ): Promise<void> {
    const oldStatus = contract.status;

    // Xử lý khi chuyển sang ACTIVE
    if (
      newStatus === ContractStatus.ACTIVE &&
      oldStatus !== ContractStatus.ACTIVE
    ) {
      await manager.update(
        'rooms',
        { id: contract.roomId },
        { status: RoomStatus.OCCUPIED },
      );
    }

    // Xử lý khi chuyển từ ACTIVE sang trạng thái khác
    if (
      oldStatus === ContractStatus.ACTIVE &&
      newStatus !== ContractStatus.ACTIVE
    ) {
      // Kiểm tra xem có hợp đồng ACTIVE nào khác cho phòng này không
      const otherActiveContracts = await this.contractsRepository
        .createQueryBuilder('contract')
        .where('contract.roomId = :roomId', { roomId: contract.roomId })
        .andWhere('contract.id != :currentContractId', {
          currentContractId: contract.id,
        })
        .andWhere('contract.status = :status', {
          status: ContractStatus.ACTIVE,
        })
        .getCount();

      if (otherActiveContracts === 0) {
        await manager.update(
          'rooms',
          { id: contract.roomId },
          { status: RoomStatus.AVAILABLE },
        );
      }
    }
  }
}
