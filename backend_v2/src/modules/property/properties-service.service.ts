import { BaseService } from 'src/common/base/crud/base.service';

import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
import { Services } from '../services/entities/services.entity';
import { PropertiesCreateOrUpdateDto } from './dto/properties-service-dto/properties-create-or-update.dto';
import { CreatePropertyServiceDto } from './dto/properties-service-dto/properties-service.create.dto';
import { PropertyServiceDetailDto } from './dto/properties-service-dto/properties-service.detail.dto';
import { PropertyServiceListDto } from './dto/properties-service-dto/properties-service.list.dto';
import { PropertyServiceUpdateDto } from './dto/properties-service-dto/properties-service.update.dto';
import { PropertiesService } from './entities/properties-service.entity';
import { PropertiesServiceRepository } from './repositories/properties-service.repository';

@Injectable()
export class PropertiesServiceService extends BaseService<
  PropertiesService,
  PropertyServiceDetailDto,
  PropertyServiceListDto,
  CreatePropertyServiceDto,
  PropertyServiceUpdateDto
> {
  constructor(
    private readonly propertiesServiceRepository: PropertiesServiceRepository,
    private readonly dataSource: DataSource,
  ) {
    super(
      propertiesServiceRepository,
      PropertyServiceDetailDto,
      PropertyServiceListDto,
      CreatePropertyServiceDto,
      PropertyServiceUpdateDto,
    );
  }

  async createOrUpdate(
    dto: PropertiesCreateOrUpdateDto[],
    propertyId: string,
    removeServiceIds?: string[],
    manager?: EntityManager,
  ): Promise<void> {
    // If a manager is provided, assume caller handles transaction lifecycle
    if (manager) {
      if (removeServiceIds && removeServiceIds.length > 0) {
        await manager
          .createQueryBuilder()
          .delete()
          .from(PropertiesService)
          .where({ id: In(removeServiceIds) })
          .execute();
      }

      for (const d of dto) {
        const treatAsNew = d.isNew || !d.id;

        if (treatAsNew) {
          if (d.serviceId) {
            const existedMapping = await manager.findOne(PropertiesService, {
              where: { propertyId, serviceId: d.serviceId },
            });

            if (existedMapping) {
              await manager.update(PropertiesService, existedMapping.id, {
                price: d.price,
                calculationMethod: d.calculationMethod,
                name: d.name,
              });
            } else {
              const mapping = new PropertiesService();
              mapping.propertyId = propertyId;
              mapping.serviceId = d.serviceId;
              mapping.price = d.price ?? 0;
              mapping.calculationMethod = d.calculationMethod;
              mapping.name = d.name ?? '';
              await manager.save(PropertiesService, mapping);
            }
          } else {
            const newService = new Services();
            newService.name = d.name;
            newService.price = d.price;
            newService.calculationMethod = d.calculationMethod;
            newService.isActive = true;
            newService.isDefaultSelected = false;

            const createdService = await manager.save(Services, newService);

            const mapping = new PropertiesService();
            mapping.propertyId = propertyId;
            mapping.price = d.price ?? 0;
            mapping.calculationMethod = d.calculationMethod;
            mapping.name = d.name ?? '';
            mapping.serviceId = createdService.id;

            await manager.save(PropertiesService, mapping);
          }
        } else {
          await manager.update(PropertiesService, d.id, {
            price: d.price,
            calculationMethod: d.calculationMethod,
            name: d.name,
          });
        }
      }
      return;
    }

    // Fallback: self-managed transaction if no manager provided
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (removeServiceIds && removeServiceIds.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(PropertiesService)
          .where({ id: In(removeServiceIds) })
          .execute();
      }

      for (const d of dto) {
        const treatAsNew = d.isNew || !d.id;

        if (treatAsNew) {
          if (d.serviceId) {
            const existedMapping = await queryRunner.manager.findOne(
              PropertiesService,
              { where: { propertyId, serviceId: d.serviceId } },
            );

            if (existedMapping) {
              await queryRunner.manager.update(
                PropertiesService,
                existedMapping.id,
                {
                  price: d.price,
                  calculationMethod: d.calculationMethod,
                  name: d.name,
                },
              );
            } else {
              const mapping = new PropertiesService();
              mapping.propertyId = propertyId;
              mapping.serviceId = d.serviceId;
              mapping.price = d.price ?? 0;
              mapping.calculationMethod = d.calculationMethod;
              mapping.name = d.name ?? '';
              await queryRunner.manager.save(PropertiesService, mapping);
            }
          } else {
            const newService = new Services();
            newService.name = d.name;
            newService.price = d.price;
            newService.calculationMethod = d.calculationMethod;
            newService.isActive = true;
            newService.isDefaultSelected = false;

            const createdService = await queryRunner.manager.save(
              Services,
              newService,
            );

            const mapping = new PropertiesService();
            mapping.propertyId = propertyId;
            mapping.price = d.price ?? 0;
            mapping.calculationMethod = d.calculationMethod;
            mapping.name = d.name ?? '';
            mapping.serviceId = createdService.id;

            await queryRunner.manager.save(PropertiesService, mapping);
          }
        } else {
          await queryRunner.manager.update(PropertiesService, d.id, {
            price: d.price,
            calculationMethod: d.calculationMethod,
            name: d.name,
          });
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
