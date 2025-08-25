import { ServiceCalculateMethod } from "@/constant/service.constant";

export interface ContractService {
  id: string;
  contractId: string;
  serviceId: string;
  propertyServiceId?: string;
  price: number;
  calculationMethod: ServiceCalculateMethod;
  isEnabled: boolean;
  notes?: string;
  name?: string;
}

export interface ContractServiceCreateRequest {
  propertyServiceId?: string;
  price?: number;
  calculationMethod: ServiceCalculateMethod;
  isEnabled?: boolean;
  notes?: string;
  name?: string;
  fieldId?: string;
}

export interface ContractServiceUpdateRequest {
  id: string;
  propertyServiceId?: string;
  price?: number;
  isEnabled?: boolean;
  notes?: string;
  calculationMethod?: ServiceCalculateMethod;
}

export interface ContractServiceDetailResponse
  extends Omit<ContractService, "contractId"> {
  contractId?: string;
}
