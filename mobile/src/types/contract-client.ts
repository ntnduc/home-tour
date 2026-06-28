import { ClientDetailResponse } from './client';

export interface ContractClient {
  id: string;
  clientId: string;
  name: string;
  isLandlordClient: boolean;
  moveInDate?: Date;
  moveOutDate?: Date;
  isActiveInContract: boolean;
}

export interface ContractClientDetailResponse extends ContractClient {
  phoneNumber?: string;
  client?: ClientDetailResponse;
}

export interface ContractClientListResponse extends ContractClient {
  phoneNumber?: string;
  client?: ClientDetailResponse;
}

export interface ContractClientCreateRequest extends ContractClient { }

export interface ContractClientUpdateRequest extends ContractClient { }
