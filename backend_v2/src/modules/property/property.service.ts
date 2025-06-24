import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/crud/base.service';
import { IBaseService } from 'src/common/base/crud/IService';
import { DataSource, In, Repository } from 'typeorm';
import { Services } from '../services/entities/services.entity';
import { PropertyCreateDto } from './dto/property.create.dto';
import { PropertyDetailDto } from './dto/property.detail.dto';
import { PropertyListDto } from './dto/property.list.dto';
import { PropertyUpdateDto } from './dto/property.update.dto';
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
      const servicesDto = propertyCreateDto.services;
      const propertiesServices: PropertiesService[] = [];

      if (servicesDto && servicesDto.length > 0) {
        const serviceIds = servicesDto.map((serviceDto) => serviceDto.id);
        //
        const serviceEntities = await queryRunner.manager.find(Services, {
          where: {
            id: In(serviceIds),
          },
        });

        servicesDto.forEach((serviceDto) => {
          const findServiceExited = serviceEntities.find(
            (service) => service.id === serviceDto.id,
          );
          if (findServiceExited) {
            const propertiesServiceEntity = new PropertiesService();
            propertiesServiceEntity.service = findServiceExited;
            propertiesServiceEntity.calculationMethod =
              serviceDto.calculationMethod;
            // create new properties service
            const newPropertiesService = queryRunner.manager.create(
              PropertiesService,
              propertiesServiceEntity,
            );
            propertiesServices.push(newPropertiesService);
          } else {
            const serviceEntity = serviceDto.getEntity();
            const newService = queryRunner.manager.create(
              Services,
              serviceEntity,
            );
            const propertiesServiceEntity = new PropertiesService();
            propertiesServiceEntity.calculationMethod =
              serviceDto.calculationMethod;
            propertiesServiceEntity.service = newService;

            // create new properties service
            const newPropertiesService = queryRunner.manager.create(
              PropertiesService,
              propertiesServiceEntity,
            );
            propertiesServices.push(newPropertiesService);
          }
        });
      }

      // create new properties
      const propertiesCreateEntity = propertyCreateDto.getEntity();
      propertiesCreateEntity.services = propertiesServices;
      const propertiesEntity = queryRunner.manager.create(
        Properties,
        propertiesCreateEntity,
      );
      console.log(
        '💞💓💗💞💓💗 ~ overridecreate ~ propterties:',
        propertiesEntity,
      );
      const properties = await this.propertiesRepository.save(propertiesEntity);
      // const propterties = await queryRunner.manager.save(propertiesEntity);

      await queryRunner.commitTransaction();
      const result = new PropertyDetailDto();
      result.fromEntity(properties);
      return result;
    } catch (err) {
      // console.error('💞💓💗💞💓💗 ~ overridecreate ~ err:', err);
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException('Lỗi khi tạo property!');
    } finally {
      await queryRunner.release();
    }
  }
}
