import { ServiceCalculateMethod } from "@/constant/service.constant";

export interface Service {
  id: number;
  name: string;
  price: number;
  calculationMethod: ServiceCalculateMethod;
  icon?: string;
}

export interface ServiceCreateRequest {
  id?: string;
  index: number;
  name: string;
  icon?: string;
  price: number;
  calculationMethod: ServiceCalculateMethod;
}

export interface ServiceListResponse extends Service {}
