import { ServiceCalculateMethod } from "@/constant/service.constant";

export interface Service {
  id: number;
  name: string;
  price: number;
  priceType: ServiceCalculateMethod;
}

export interface ServiceCreateRequest {
  name: string;
  price: number;
  calculationMethod: ServiceCalculateMethod;
}
