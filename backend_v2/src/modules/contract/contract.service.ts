import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus } from 'src/common/enums/contract.enum';
import { DataSource, EntityManager, SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../../common/base/crud/base.service';
import { IBaseService } from '../../common/base/crud/IService';
import { RoomStatus } from '../../common/enums/room.enum';
import { PropertiesServiceRepository } from '../property/repositories/properties-service.repository';
import { RoomsRepository } from '../property/repositories/rooms.repository';
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
      .leftJoinAndSelect('contract.primaryTenant', 'primaryTenant')
      .leftJoinAndSelect('contract.landlord', 'landlord')
      .leftJoinAndSelect('contract.contractProperties', 'contractProperties')
      .leftJoinAndSelect('contractProperties.property', 'contractProperty');

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
        throw new BadRequestException('Phòng không ở trạng thái trống');
      }

      // Kiểm tra không có hợp đồng ACTIVE nào cho phòng này
      const activeContractExists =
        await this.contractsRepository.findActiveContractByRoomId(
          createDto.roomId,
        );

      if (activeContractExists) {
        throw new BadRequestException('Phòng đã có hợp đồng đang hoạt động');
      }

      // Tạo hợp đồng
      const contractEntity = createDto.getEntity();
      const savedContract = await queryRunner.manager.save(
        Contracts,
        contractEntity,
      );

      // Tạo contract properties nếu có
      if (
        createDto.contractProperties &&
        createDto.contractProperties.length > 0
      ) {
        for (const propertyDto of createDto.contractProperties) {
          propertyDto.contractId = savedContract.id;
          const propertyEntity = propertyDto.getEntity();
          await queryRunner.manager.save(propertyEntity);
        }
      }

      // Tạo contract services nếu có
      if (createDto.contractServices && createDto.contractServices.length > 0) {
        await this.createContractServices(
          savedContract.id,
          createDto.contractServices,
          queryRunner.manager,
        );
      }

      // Cập nhật trạng thái phòng nếu hợp đồng ACTIVE
      if (savedContract.status === ContractStatus.ACTIVE) {
        await queryRunner.manager.update(
          'rooms',
          { id: createDto.roomId },
          { status: RoomStatus.OCCUPIED },
        );
      }

      await queryRunner.commitTransaction();

      // Lấy thông tin chi tiết hợp đồng vừa tạo
      const detailContract = await this.contractsRepository.findWithRelations(
        savedContract.id,
      );
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
      const detailContract =
        await this.contractsRepository.findWithRelations(id);
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

  async findById(id: string): Promise<ContractDetailDto> {
    const contract = await this.contractsRepository.findWithRelations(id);
    if (!contract) {
      throw new NotFoundException('Hợp đồng không tồn tại');
    }

    const detailDto = new ContractDetailDto();
    detailDto.fromEntity(contract);
    return detailDto;
  }

  async findByRoomId(roomId: string): Promise<ContractListDto[]> {
    const contracts = await this.contractsRepository.findByRoomId(roomId);
    return this.beautifyResult(contracts);
  }

  async findActiveContractByRoomId(
    roomId: string,
  ): Promise<ContractDetailDto | null> {
    const contract =
      await this.contractsRepository.findActiveContractByRoomId(roomId);
    if (!contract) {
      return null;
    }

    const detailDto = new ContractDetailDto();
    detailDto.fromEntity(contract);
    return detailDto;
  }

  private async createContractServices(
    contractId: string,
    contractServicesDto: ContractServiceCreateDto[],
    manager: EntityManager,
  ): Promise<void> {
    for (const serviceDto of contractServicesDto) {
      if (serviceDto.propertyServiceId) {
        // Trường hợp 1: Clone từ property service
        const propertyService = await this.propertiesServiceRepository.findOne({
          where: { id: serviceDto.propertyServiceId },
          relations: ['service'],
        });

        if (propertyService) {
          const contractService = {
            contractId: contractId,
            serviceId: propertyService.serviceId,
            price: serviceDto.price ?? propertyService.price,
            isEnabled: serviceDto.isEnabled ?? true,
            notes: serviceDto.notes,
          };
          await manager.save('contract_services', contractService);
        }
      } else {
        // Trường hợp 2: Tạo mới hoàn toàn
        serviceDto.contractId = contractId;
        const serviceEntity = serviceDto.getEntity();
        await manager.save(serviceEntity);
      }
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
