import { ServiceCalculateMethod } from "@/constant/service.constant";

export interface Service {
  id: number;
  name: string;
  price: number;
  calculationMethod: ServiceCalculateMethod;
}

export interface ServiceCreateRequest {
  index: number;
  name: string;
  price: number;
  calculationMethod: ServiceCalculateMethod;
}
