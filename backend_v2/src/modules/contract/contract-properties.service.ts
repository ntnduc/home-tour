import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ContractPropertyCreateDto } from './dto/contract-properties-dto/contract-property.create.dto';
import { ContractPropertyUpdateDto } from './dto/contract-properties-dto/contract-property.update.dto';
import { ContractProperties } from './entities/contract-properties.entity';
import { ContractPropertiesRepository } from './repositories/contract-properties.repository';
import { ContractsRepository } from './repositories/contracts.repository';

@Injectable()
export class ContractPropertiesService {
  constructor(
    private readonly contractPropertiesRepository: ContractPropertiesRepository,
    private readonly contractsRepository: ContractsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createDto: ContractPropertyCreateDto,
  ): Promise<ContractProperties> {
    // Kiểm tra hợp đồng tồn tại
    const contract = await this.contractsRepository.findOne({
      where: { id: createDto.contractId },
    });

    if (!contract) {
      throw new NotFoundException('Hợp đồng không tồn tại');
    }

    // Kiểm tra người dùng chưa được thêm vào hợp đồng này
    const existingProperty = await this.contractPropertiesRepository.findOne({
      where: {
        contractId: createDto.contractId,
        propertyUserId: createDto.propertyUserId,
      },
    });

    if (existingProperty) {
      throw new BadRequestException('Người này đã được thêm vào hợp đồng');
    }

    const propertyEntity = createDto.getEntity();
    return await this.contractPropertiesRepository.save(propertyEntity);
  }

  async update(
    id: string,
    updateDto: ContractPropertyUpdateDto,
  ): Promise<ContractProperties> {
    const existingProperty = await this.contractPropertiesRepository.findOne({
      where: { id },
    });

    if (!existingProperty) {
      throw new NotFoundException('Thông tin người thuê không tồn tại');
    }

    const updateData = updateDto.getEntity(existingProperty);
    await this.contractPropertiesRepository.update({ id }, updateData);

    const result = await this.contractPropertiesRepository.findOne({
      where: { id },
      relations: ['property'],
    });

    if (!result) {
      throw new NotFoundException(
        'Thông tin người thuê không tồn tại sau khi cập nhật',
      );
    }

    return result;
  }

  async findByContractId(contractId: string): Promise<ContractProperties[]> {
    return await this.contractPropertiesRepository.findByContractId(contractId);
  }

  async findActivePropertiesByContractId(
    contractId: string,
  ): Promise<ContractProperties[]> {
    return await this.contractPropertiesRepository.findActivePropertiesByContractId(
      contractId,
    );
  }

  async findByPropertyUserId(
    propertyUserId: string,
  ): Promise<ContractProperties[]> {
    return await this.contractPropertiesRepository.findByPropertyUserId(
      propertyUserId,
    );
  }

  async remove(id: string): Promise<void> {
    const property = await this.contractPropertiesRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Thông tin người thuê không tồn tại');
    }

    await this.contractPropertiesRepository.delete({ id });
  }

  async moveOut(id: string, moveOutDate: Date): Promise<ContractProperties> {
    const property = await this.contractPropertiesRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Thông tin người thuê không tồn tại');
    }

    await this.contractPropertiesRepository.update(
      { id },
      {
        moveOutDate,
        isActiveInContract: false,
      },
    );

    const result = await this.contractPropertiesRepository.findOne({
      where: { id },
      relations: ['property'],
    });

    if (!result) {
      throw new NotFoundException(
        'Thông tin người thuê không tồn tại sau khi cập nhật',
      );
    }

    return result;
  }

  async moveIn(id: string, moveInDate: Date): Promise<ContractProperties> {
    const property = await this.contractPropertiesRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Thông tin người thuê không tồn tại');
    }

    await this.contractPropertiesRepository.update(
      { id },
      {
        moveInDate,
        isActiveInContract: true,
        moveOutDate: undefined, // Reset move out date
      },
    );

    const result = await this.contractPropertiesRepository.findOne({
      where: { id },
      relations: ['property'],
    });

    if (!result) {
      throw new NotFoundException(
        'Thông tin người thuê không tồn tại sau khi cập nhật',
      );
    }

    return result;
  }
}
