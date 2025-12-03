import { PropertyService } from "@/entities/PropertyService";
import { ServiceCalculationMethod } from "@/entities/Service";

export class CreatePropertyServiceRequest {
  name: string;
  price: number;
  unit?: string;
  calculationMethod: ServiceCalculationMethod;

  toEntity(): PropertyService {
    const propertyService = new PropertyService();
    propertyService.price = this.price;
    propertyService.unit = this.unit ?? "none";
    propertyService.isActive = true;
    propertyService.calculationMethod = this.calculationMethod;
    return propertyService;
  }
}
