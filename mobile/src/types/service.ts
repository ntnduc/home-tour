import { ServiceCalculateMethod } from "@/constant/service.constant";

export interface Service {
  id: string;
  name: string;
  price: number;
  calculationMethod: ServiceCalculateMethod;
  icon?: string;
}

export interface ServiceCreateRequest {
  id?: string;
  name: string;
  icon?: string;
  price: number;
  calculationMethod: ServiceCalculateMethod;
}

export interface ServiceListResponse extends Service {}

export interface ServiceDefaultResponse extends Service {}
