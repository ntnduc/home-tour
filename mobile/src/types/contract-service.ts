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
  isNew?: boolean;
  name?: string;
  isSelectedFromService?: boolean;
  service?: {
    id: string;
    name: string;
    icon?: string;
  };
}

export interface ContractServiceCreateRequest {
  contractId?: string;
  serviceId?: string;
  propertyServiceId?: string;
  price?: number;
  calculationMethod: ServiceCalculateMethod;
  isEnabled?: boolean;
  notes?: string;
  isNew?: boolean;
  name?: string;
  isSelectedFromService?: boolean;
}

export interface ContractServiceUpdateRequest {
  id: string;
  propertyServiceId?: string;
  price?: number;
  isEnabled?: boolean;
  notes?: string;
  calculationMethod?: ServiceCalculateMethod;
}

export interface ContractServiceDetailResponse extends ContractService {
  service: {
    id: string;
    name: string;
    icon?: string;
  };
}
