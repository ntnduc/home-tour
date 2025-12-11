export interface Client {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  idCardNumber?: string;
  permanentAddress?: string;
  isLandlordClient: boolean;
  dateOfBirth?: Date;
  profilePictureURL?: string;
  isActive: boolean;
  notes?: string;
  contractId?: string;
}

export interface ClientCreateRequest extends Omit<Client, 'id'> {}

export interface ClientUpdateRequest extends Client {}

export interface ClientDetailResponse extends Client {}

export interface ClientListResponse extends Client {}
