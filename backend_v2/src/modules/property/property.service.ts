import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { IBaseService } from 'src/common/base/crud/IService';
import { ComboOptionWithExtra } from 'src/common/base/dto/option.dto';
import { PropertyRoomsStatus } from 'src/common/enums/property.enum';
import { RoomStatus } from 'src/common/enums/room.enum';
import { DataSource, In, Repository, SelectQueryBuilder } from 'typeorm';
import { CurrentUserService } from '../current.user';
import { Districts } from '../location/entities/Districts.entity';
import { Provinces } from '../location/entities/Provinces.entity';
import { Wards } from '../location/entities/Wards.entity';
import { CreateServiceDto } from '../services/dto/services.create.dto';
import { ServiceDetailDto } from '../services/dto/services.detail.dto';
import { Services } from '../services/entities/services.entity';
import { ServicesRepository } from '../services/repositories/services.repository';
import { PropertyCreateDto } from './dto/properties-dto/property.create.dto';
import { PropertyDetailDto } from './dto/properties-dto/property.detail.dto';
import { PropertyListDto } from './dto/properties-dto/property.list.dto';
import { PropertyUpdateDto } from './dto/properties-dto/property.update.dto';
import { PropertiesService } from './entities/properties-service.entity';
import { Properties } from './entities/properties.entity';
import { Rooms } from './entities/rooms.entity';
import { PropertiesServiceRepository } from './repositories/properties-service.repository';
import { PropertiesRepository } from './repositories/properties.repository';
import { RoomsRepository } from './repositories/rooms.repository';
import { RoomsService } from './rooms.service';

@Injectable()
export class PropertyService
  extends BaseService<
    Properties,
    PropertyDetailDto,
    PropertyListDto,
    PropertyCreateDto,
    PropertyUpdateDto
  >
  implements
    IBaseService<
      Properties,
      PropertyDetailDto,
      PropertyListDto,
      PropertyCreateDto,
      PropertyUpdateDto
    >
{
  constructor(
    private propertiesRepository: PropertiesRepository,
    private servicesRepository: ServicesRepository,
    private roomsRepository: RoomsRepository,
    @InjectRepository(Provinces)
    private provincesRepository: Repository<Provinces>,
    @InjectRepository(Districts)
    private districtsRepository: Repository<Districts>,
    @InjectRepository(Wards)
    private wardsRepository: Repository<Wards>,

    //#region Inject services
    private readonly dataSource: DataSource,
    private readonly roomService: RoomsService,
    private readonly currentUserService: CurrentUserService,
    private propertiesServicesRepository: PropertiesServiceRepository,
    //#endregion
  ) {
    super(
      propertiesRepository,
      PropertyDetailDto,
      PropertyListDto,
      PropertyCreateDto,
      PropertyUpdateDto,
    );
  }

  async getComboProperty() {
    const userId = this.currentUserService.getCurrentUserId();
    const properties = await this.propertiesRepository.find({
      where: { ownerId: userId },
    });

    const result = properties.map((property) => {
      const comboOption = new ComboOptionWithExtra<
        string,
        string,
        PropertyDetailDto
      >();
      const dto = new PropertyDetailDto();
      dto.fromEntity(property);
      comboOption.label = property.name ?? '';
      comboOption.value = property.id;
      comboOption.extra = dto;
      return comboOption;
    });

    return result;
  }

  override async create(propertyCreateDto: PropertyCreateDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const propertyEntity = propertyCreateDto.getEntity();
      // Set ownerId from current user
      const currentUserId = this.currentUserService.getCurrentUserId();
      propertyEntity.ownerId = currentUserId;

      const property = this.propertiesRepository.create(propertyEntity);
      await queryRunner.manager.save(property);

      //  Create services
      if (propertyCreateDto.services && propertyCreateDto.services.length > 0) {
        const serivceIds = propertyCreateDto.services
          .filter((service) => service.id)
          .map((service) => service.id);

        const serviceExited: Services[] = await this.servicesRepository.find({
          where: {
            id: In(serivceIds),
          },
        });

        const serviceUnExited: CreateServiceDto[] =
          propertyCreateDto.services.filter(
            (service) =>
              !serviceExited.find(
                (serviceExit) => serviceExit.id === service.id,
              ),
          );

        const services: Services[] = serviceUnExited.map((service) => {
          const serviceEntity = service.getEntity();
          return serviceEntity;
        });

        const newServices = this.servicesRepository.create(services);
        await queryRunner.manager.save(newServices);

        const propertiesServices: PropertiesService[] = [];
        newServices.forEach((service) => {
          const propertiesServiceEntity = new PropertiesService();
          propertiesServiceEntity.propertyId = property.id;
          propertiesServiceEntity.serviceId = service.id;
          propertiesServiceEntity.calculationMethod = service.calculationMethod;
          propertiesServiceEntity.name = service.name;
          propertiesServiceEntity.price = service.price;
          propertiesServices.push(propertiesServiceEntity);
        });

        serviceExited.forEach((service) => {
          const propertiesServiceEntity = new PropertiesService();
          const findServiceDto = propertyCreateDto.services?.find(
            (serviceDto) => serviceDto.id && serviceDto.id === service.id,
          );
          propertiesServiceEntity.propertyId = property.id;
          propertiesServiceEntity.serviceId = service.id;
          propertiesServiceEntity.calculationMethod =
            findServiceDto?.calculationMethod || service.calculationMethod;
          propertiesServiceEntity.name = findServiceDto?.name || service.name;
          propertiesServiceEntity.price =
            findServiceDto?.price || service.price;
          propertiesServices.push(propertiesServiceEntity);
        });

        const newPropertiesServices =
          this.propertiesServicesRepository.create(propertiesServices);
        await queryRunner.manager.save(newPropertiesServices);
      }

      // Create rooms
      const rooms =
        this.roomService.getRoomsDefaultFromTotalNumberRooms(propertyCreateDto);
      if (rooms && rooms.length > 0) {
        rooms.forEach((room) => (room.propertyId = property.id));
        const newRooms = this.roomsRepository.create(rooms);
        await queryRunner.manager.save(newRooms);
      }

      await queryRunner.commitTransaction();
      const result = new PropertyDetailDto();
      result.fromEntity(property);
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException('Lỗi khi tạo property!');
    } finally {
      await queryRunner.release();
    }
  }

  override async update(dto: PropertyUpdateDto): Promise<PropertyDetailDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Lấy property hiện tại (bao gồm relations services)
      const property = await this.propertiesRepository.findOne({
        where: { id: dto.id },
        relations: ['services', 'services.service'],
      });
      if (!property) throw new NotFoundException('Property not found');

      // 2. So sánh danh sách service cũ và mới
      const oldServiceIds = property.services.map((s) => s.serviceId as string);

      const newServiceIds =
        dto.services
          ?.map((s) => s.id as string)
          .filter((id): id is string => !!id) || [];

      // 2.1. Service cần xoá
      const removeServiceIds = oldServiceIds.filter(
        (id) => !newServiceIds.includes(id),
      );

      if (removeServiceIds.length) {
        await this.propertiesServicesRepository
          .createQueryBuilder()
          .delete()
          .where('propertyId = :propertyId AND serviceId IN (:...serviceIds)', {
            propertyId: property.id,
            serviceIds: removeServiceIds,
          })
          .execute();
      }

      // 2.2. Service cần thêm mới (serviceId chưa có trong property)
      const addServiceDtos = (
        (dto.services || []) as CreateServiceDto[]
      ).filter((s) => !oldServiceIds.includes(s.id as string));
      // Nếu service là mới hoàn toàn (chưa có id) thì tạo mới ở bảng service
      const newServiceEntities = addServiceDtos
        .filter((s) => !s.id)
        .map((s) => s.getEntity());
      let createdServices: Services[] = [];
      if (newServiceEntities.length) {
        createdServices =
          await this.servicesRepository.save(newServiceEntities);
      }
      // Mapping lại id cho các service vừa tạo
      addServiceDtos.forEach((s) => {
        if (!s.id) {
          const created = createdServices.find((cs) => cs.name === s.name);
          if (created) s.id = created.id;
        }
      });

      // Tạo mapping property-service cho các service mới
      const newMappings = addServiceDtos.map((s) => {
        const mapping = new PropertiesService();
        mapping.propertyId = property.id;
        mapping.serviceId = s.id as string;
        mapping.calculationMethod = s.calculationMethod;
        mapping.name = s.name;
        mapping.price = s.price;
        return mapping;
      });
      if (newMappings.length) {
        await this.propertiesServicesRepository.save(newMappings);
      }

      // 2.3. Service cần cập nhật (có trong cả hai, nhưng thông tin khác)
      const updateServiceDtos = (
        (dto.services || []) as CreateServiceDto[]
      ).filter((s) => oldServiceIds.includes(s.id as string));
      for (const s of updateServiceDtos) {
        await this.propertiesServicesRepository
          .createQueryBuilder()
          .update()
          .set({
            calculationMethod: s.calculationMethod,
            name: s.name,
            price: s.price,
          })
          .where('propertyId = :propertyId AND serviceId = :serviceId', {
            propertyId: property.id,
            serviceId: s.id as string,
          })
          .execute();
      }

      // 3. Cập nhật các field khác của property
      const updatedEntity = dto.getEntity(property);
      const cloneUpdatedEntity = Object.assign({}, updatedEntity);
      if (cloneUpdatedEntity.services) {
        cloneUpdatedEntity.services = undefined;
      }
      await this.propertiesRepository.update(property.id, cloneUpdatedEntity);

      // 4. Trả về detailDto
      const result = await this.get(property.id);
      return result;
    } catch (err) {
      console.error('Update property error:', err);
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException('Lỗi khi cập nhật căn hộ!');
    } finally {
      await queryRunner.release();
    }
  }

  override async get(id: string): Promise<PropertyDetailDto> {
    const property = await this.propertiesRepository.findOne({
      where: { id },
      relations: ['services', 'services.service'],
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const result = new PropertyDetailDto();

    const services = property.services.map((service) => {
      const serviceDto = new ServiceDetailDto();
      serviceDto.fromEntity(service.service);
      return serviceDto;
    });
    result.services = services;
    result.fromEntity(property);

    return result;
  }

  override async specQuery(): Promise<SelectQueryBuilder<Properties>> {
    const query = this.propertiesRepository.createQueryBuilder('entity');

    query.leftJoinAndSelect('entity.rooms', 'rooms');
    query.leftJoinAndSelect('entity.services', 'services');
    return query;
  }

  override async beautifyResult(
    items: Properties[],
  ): Promise<PropertyListDto[]> {
    const provinceCodes = items.map((item) => item.provinceCode);
    const districtCodes = items.map((item) => item.districtCode);
    const wardCodes = items.map((item) => item.wardCode);

    let provinces: Provinces[] = [];
    let districts: Districts[] = [];
    let wards: Wards[] = [];

    if (provinceCodes.length > 0) {
      provinces = await this.provincesRepository.find({
        where: { code: In(provinceCodes) },
      });
    }

    if (districtCodes.length > 0) {
      districts = await this.districtsRepository.find({
        where: { code: In(districtCodes) },
      });
    }

    if (wardCodes.length > 0) {
      wards = await this.wardsRepository.find({
        where: { code: In(wardCodes) },
      });
    }

    const result = items.map((item) => {
      const listDto = new PropertyListDto();
      listDto.fromEntity(item);
      listDto.statusRooms = this.statusRooms(item.rooms);

      const province = provinces.find(
        (province) => province.code === item.provinceCode,
      )?.full_name;
      const district = districts.find(
        (district) => district.code === item.districtCode,
      )?.full_name;
      const ward = wards.find((ward) => ward.code === item.wardCode)?.full_name;

      const address = `${item.address} - ${ward} - ${district} - ${province}`;
      listDto.address = address;

      return listDto;
    });
    return result;
  }

  //#region support function

  private statusRooms(rooms: Rooms[]): PropertyRoomsStatus {
    if (rooms.length === 0) return PropertyRoomsStatus.EMPTY;
    const countRoomsOccupied = rooms.filter(
      (room) => room.status === RoomStatus.OCCUPIED,
    ).length;

    return countRoomsOccupied === rooms.length
      ? PropertyRoomsStatus.FULL
      : PropertyRoomsStatus.PARTIAL;
  }

  //#endregion
}
