import { AppDataSource } from "../../config/database";
import { CreatePropertyRequest } from "../../dtos/property/property.dto";
import { Properties } from "../../entities/Properties";

export class PropertyService {
  private static propertyRepository = AppDataSource.getRepository(Properties);

  static async createProperty(property: CreatePropertyRequest) {
    const propertyEntity = property.toEntity();
    console.log(
      "💞💓💗💞💓💗 ~ PropertyService ~ createProperty ~ propertyEntity:",
      propertyEntity
    );

    // if (property.propertyServices && property.propertyServices.length > 0) {
    //   const propertyServices = property.propertyServices.map((service) => {
    //     const propertyService = new PropertyService();
    //     propertyService.property = propertyEntity;
    //     propertyService.service = service.toEntity();
    //     return propertyService;
    //   });
    //   propertyEntity.propertyServices = propertyServices;
    // }

    const newProperty =
      PropertyService.propertyRepository.create(propertyEntity);

    return PropertyService.propertyRepository.save(newProperty);
  }
}
