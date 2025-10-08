export interface Client {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  idCardNumber?: string;
  permanentAddress?: string;
  dateOfBirth?: Date;
  profilePictureURL?: string;
  isActive: boolean;
  notes?: string;
  contractId?: string;
}

export interface ClientCreateRequest extends Omit<Client, "id"> {}

export interface ClientUpdateRequest extends Client {}

export interface ClientDetailResponse extends Client {}

export interface ClientListResponse extends Client {}
