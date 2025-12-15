import { ClientCreateRequest } from './client';
import { ContractClientDetailResponse } from './contract-client';
import {
  ContractServiceCreateRequest,
  ContractServiceDetailResponse,
} from './contract-service';
import { PropertyDetail } from './property';
import { RoomDetailResponse } from './room';

export enum ContractStatus {
  PENDING_START = 'PENDING_START',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  TERMINATED_EARLY = 'TERMINATED_EARLY',
  EXPIRED = 'EXPIRED',
}

export interface Contract {
  id: string;
  propertyId: string;
  roomId: string;
  startDate: string;
  endDate?: string;
  rentAmountAgreed: number;
  depositAmountPaid: number;
  paymentDueDay: number;
  contractScanURL?: string;
  status: ContractStatus;
  notes?: string;
  partnerClientCount?: number;
  isPrepaidRoom?: boolean;
}

export interface ContractCreateRequest extends Omit<Contract, 'id' | 'status'> {
  contractServices: ContractServiceCreateRequest[];
  contractClient: ClientCreateRequest[];
  contractClientLandlord: ClientCreateRequest;
  ignoreAutoUpdatePartnerNumber?: boolean;
}

export interface ContractUpdateRequest {
  id: string;
  propertyId?: string;
  roomId?: string;
  landlordUserId?: string;
  startDate?: string;
  endDate?: string;
  rentAmountAgreed?: number;
  depositAmountPaid?: number;
  paymentDueDay?: number;
  contractScanURL?: string;
  status?: ContractStatus;
  notes?: string;
}

export interface ContractDetailResponse extends Contract {
  room?: RoomDetailResponse;
  property?: PropertyDetail;
  contractClient: ContractClientDetailResponse[];
  contractServices: ContractServiceDetailResponse[];
}

export interface ContractListResponse {
  id: string;
  code: string;
  propertyId: string;
  roomId: string;
  landlordUserId: string;
  startDate: string;
  endDate?: string;
  rentAmountAgreed: number;
  depositAmountPaid: number;
  paymentDueDay: number;
  contractScanURL?: string;
  status: ContractStatus;
  notes?: string;
  room: {
    id: string;
    name: string;
    property: {
      id: string;
      name: string;
      address: string;
    };
  };
  primaryPropertyUser: {
    id: string;
    fullName: string;
    phone: string;
  };
}

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  [ContractStatus.PENDING_START]: 'Chờ bắt đầu',
  [ContractStatus.ACTIVE]: 'Đang hiệu lực',
  [ContractStatus.ENDED]: 'Đã kết thúc',
  [ContractStatus.TERMINATED_EARLY]: 'Đã kết thúc sớm',
  [ContractStatus.EXPIRED]: 'Hết hạn',
};

export const CONTRACT_STATUS_COLOR: Record<
  ContractStatus,
  { bg: string; color: string }
> = {
  [ContractStatus.PENDING_START]: { bg: '#F3F4F6', color: '#6B7280' },
  [ContractStatus.ACTIVE]: { bg: '#E9F9EF', color: '#34C759' },
  [ContractStatus.ENDED]: { bg: '#FFECEC', color: '#FF3B30' },
  [ContractStatus.TERMINATED_EARLY]: { bg: '#F3F4F6', color: '#6B7280' },
  [ContractStatus.EXPIRED]: { bg: '#FFF6E5', color: '#FF9500' },
};

export const CONTRACT_STATUS_ICON: Record<ContractStatus, string> = {
  [ContractStatus.PENDING_START]: 'document-outline',
  [ContractStatus.ACTIVE]: 'checkmark-circle',
  [ContractStatus.ENDED]: 'time-outline',
  [ContractStatus.TERMINATED_EARLY]: 'close-circle',
  [ContractStatus.EXPIRED]: 'ellipse-outline',
};
