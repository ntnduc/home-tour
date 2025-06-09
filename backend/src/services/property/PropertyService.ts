import { AppDataSource } from "@/config/database";
import { CreatePropertyRequest } from "@/dtos/property/property.dto";
import { Properties } from "@/entities/Properties";

export class PropertyService {
  static async createProperty(property: CreatePropertyRequest) {
    const propertyRepository = AppDataSource.getRepository(Properties);

    const propertyEntity = property.toEntity();

    if (property.propertyServices) {
      const propertyServices = property.propertyServices.map((service) =>
        service.toEntity()
      );
      propertyEntity.propertyServices = propertyServices;
    }

    const newProperty = propertyRepository.create(propertyEntity);

    return propertyRepository.save(newProperty);
  }
}
