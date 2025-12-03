export interface ContractProperty {
  id: string;
  contractId: string;
  propertyUserId: string;
  isPrimaryPropertyUser: boolean;
  name: string;
  phone: string;
  moveInDate?: string;
  moveOutDate?: string;
  isActiveInContract: boolean;
  property?: {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
  };
}

export interface ContractPropertyCreateRequest {
  contractId?: string;
  propertyUserId: string;
  isPrimaryPropertyUser?: boolean;
  name: string;
  phone: string;
  moveInDate?: string;
  moveOutDate?: string;
  isActiveInContract?: boolean;
}

export interface ContractPropertyUpdateRequest {
  id: string;
  propertyUserId?: string;
  moveInDate?: string;
  moveOutDate?: string;
  isActiveInContract?: boolean;
}

export interface ContractPropertyDetailResponse extends ContractProperty {
  property: {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
  };
}
