import { PropertyService } from "@/entities/PropertyService";
import { ServiceCalculationMethod } from "@/entities/Service";

export class CreatePropertyServiceRequest {
  propertyId: number;
  serviceId: number;
  price: number;
  unit: string;
  isActive: boolean;
  calculationMethod: ServiceCalculationMethod;

  toEntity(): PropertyService {
    const propertyService = new PropertyService();
    // propertyService.property = this.propertyId;
    // propertyService.service = this.serviceId;
    propertyService.price = this.price;
    propertyService.unit = this.unit;
    propertyService.isActive = this.isActive;
    propertyService.calculationMethod = this.calculationMethod;
    return propertyService;
  }
}
