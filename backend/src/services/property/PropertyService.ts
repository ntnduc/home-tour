import { CreatePropertyServiceRequest } from "@/dtos/property/property.service.dto";
import { In } from "typeorm";
import { AppDataSource } from "../../config/database";
import { CreatePropertyRequest } from "../../dtos/property/property.dto";
import { Properties } from "../../entities/Properties";
import { PropertyService as PropertyServiceEntity } from "../../entities/PropertyService";
import { Service } from "../../entities/Service";

export class PropertyService {
  private static propertyRepository = AppDataSource.getRepository(Properties);
  private static serviceRepository = AppDataSource.getRepository(Service);

  static async createProperty(createDto: CreatePropertyRequest) {
    const propertyService: PropertyServiceEntity[] = [];
    const serviceNotExited: CreatePropertyServiceRequest[] = [];

    const propertyEntity = createDto.toEntity();

    if (createDto.services && createDto.services.length > 0) {
      serviceNotExited.push(...createDto.services);

      const serviceExited = await this.serviceRepository.find({
        where: {
          name: In(createDto.services.map((service) => service.name)),
        },
      });

      if (serviceExited && serviceExited.length > 0) {
        serviceExited.forEach((serviceEntity) => {
          const serviceDto = createDto.services?.find(
            (service) => service.name === serviceEntity.name
          );

          if (serviceDto) {
            serviceNotExited.splice(serviceNotExited.indexOf(serviceDto), 1);
            const newPropertyService = serviceDto.toEntity();
            newPropertyService.service = serviceEntity;
            propertyService.push(newPropertyService);
          }
        });
      }
    }

    if (serviceNotExited && serviceNotExited.length > 0) {
      serviceNotExited.forEach((service) => {
        const newService = new Service();
        newService.name = service.name;
        newService.calculationMethod = service.calculationMethod;
        newService.defaultUnitName = service.unit ?? "none";

        const newPropertyService = new PropertyServiceEntity();
        newPropertyService.service = newService;
        newPropertyService.calculationMethod = service.calculationMethod;
        newPropertyService.price = service.price;
        newPropertyService.isActive = true;

        propertyService.push(newPropertyService);
      });
    }

    if (propertyService && propertyService.length > 0) {
      propertyEntity.propertyServices = propertyService;
    }

    try {
      const savedProperty = await AppDataSource.transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(propertyEntity);
        }
      );
      return savedProperty;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }
}
