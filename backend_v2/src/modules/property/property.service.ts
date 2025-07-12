import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { IBaseService } from 'src/common/base/crud/IService';
import { PropertyRoomsStatus } from 'src/common/enums/property.enum';
import { RoomStatus } from 'src/common/enums/room.enum';
import { DataSource, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Districts } from '../location/entities/Districts.entity';
import { Provinces } from '../location/entities/Provinces.entity';
import { Wards } from '../location/entities/Wards.entity';
import { CreateServiceDto } from '../services/dto/services.create.dto';
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
    @InjectRepository(Properties)
    private propertiesRepository: PropertiesRepository,
    @InjectRepository(PropertiesService)
    private propertiesServicesRepository: PropertiesServiceRepository,
    @InjectRepository(Services)
    private servicesRepository: ServicesRepository,
    @InjectRepository(Rooms)
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
  override async create(propertyCreateDto: PropertyCreateDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const propertyEntity = propertyCreateDto.getEntity();
      const property = await this.propertiesRepository.create(propertyEntity);
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

  private statusRooms(rooms: Rooms[]): PropertyRoomsStatus {
    if (rooms.length === 0) return PropertyRoomsStatus.EMPTY;
    const countRoomsOccupied = rooms.filter(
      (room) => room.status === RoomStatus.OCCUPIED,
    ).length;

    return countRoomsOccupied === rooms.length
      ? PropertyRoomsStatus.FULL
      : PropertyRoomsStatus.PARTIAL;
  }
}
