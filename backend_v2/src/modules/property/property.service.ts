import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { IBaseService } from 'src/common/base/crud/IService';
import { DataSource, In, Repository } from 'typeorm';
import { CreateServiceDto } from '../services/dto/services.create.dto';
import { Services } from '../services/entities/services.entity';
import { PropertyCreateDto } from './dto/properties-dto/property.create.dto';
import { PropertyDetailDto } from './dto/properties-dto/property.detail.dto';
import { PropertyListDto } from './dto/properties-dto/property.list.dto';
import { PropertyUpdateDto } from './dto/properties-dto/property.update.dto';
import { PropertiesService } from './entities/properties-service.entity';
import { Properties } from './entities/properties.entity';

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
    private propertiesRepository: Repository<Properties>,
    @InjectRepository(PropertiesService)
    private propertiesServicesRepository: Repository<PropertiesService>,
    @InjectRepository(Services)
    private servicesRepository: Repository<Services>,

    private readonly dataSource: DataSource,
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
          propertiesServices.push(propertiesServiceEntity);
        });

        const newPropertiesServices =
          this.propertiesServicesRepository.create(propertiesServices);
        await queryRunner.manager.save(newPropertiesServices);
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
}
