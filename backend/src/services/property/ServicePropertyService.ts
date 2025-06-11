import { AppDataSource } from "../../config/database";
import { Service } from "../../entities/Service";

export class ServicePropertyService {
  private static serviceRepository = AppDataSource.getRepository(Service);

  static async getComboServices() {
    const services = await this.serviceRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
    return services.map((service: Service) => ({
      key: service.id,
      value: service.id,
      label: service.name,
    }));
  }
}
