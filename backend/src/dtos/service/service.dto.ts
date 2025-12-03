import { ServiceCalculationMethod } from "@/entities/Service";

export class CreateServiceRequest {
  name: string;
  description: string;
  calculationMethod: ServiceCalculationMethod;
  defaultUnitName: string;
}

export class DetailServiceResponse {
  id: number;
  name: string;
  description: string;
  calculationMethod: ServiceCalculationMethod;
  defaultUnitName: string;
}
