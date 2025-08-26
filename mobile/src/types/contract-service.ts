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
  helperValue?: number;
}

export interface ContractServiceCreateRequest
  extends Omit<ContractService, "id" | "contractId"> {
  fieldId?: string;
}

export interface ContractServiceUpdateRequest
  extends Omit<ContractService, "contractId"> {
  fieldId?: string;
}

export interface ContractServiceDetailResponse
  extends Omit<ContractService, "contractId"> {
  contractId?: string;
}
