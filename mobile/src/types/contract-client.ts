import { Client } from "./client";

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
  client?: Client;
}

export interface ContractClientListResponse extends ContractClient {}

export interface ContractClientCreateRequest extends ContractClient {}

export interface ContractClientUpdateRequest extends ContractClient {}
