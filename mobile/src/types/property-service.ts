import { ServiceCalculateMethod } from "@/constant/service.constant";

export interface PropertyService {
  propertyServiceId: string;
  name?: string;
  price: number;
  calculationMethod: ServiceCalculateMethod;
}

export interface PropertyServiceDetail extends PropertyService {}
