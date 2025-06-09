import { ServiceCalculationMethod } from "@/entities/Service";

export class CreatePropertyServiceRequest {
  propertyId: number;
  serviceId: number;
  price: number;
  unit: string;
  isActive: boolean;
  calculationMethod: ServiceCalculationMethod;

  toEntity() {
    return {
      ...this,
      propertyId: this.propertyId.toString(),
      serviceId: this.serviceId.toString(),
    };
  }
}
