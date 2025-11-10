import { ClientCreateRequest } from "./client";
import { ContractServiceCreateRequest } from "./contract-service";

export enum ContractStatus {
  PENDING_START = "PENDING_START",
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
  TERMINATED_EARLY = "TERMINATED_EARLY",
  EXPIRED = "EXPIRED",
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
}

export interface ContractCreateRequest extends Omit<Contract, "id" | "status"> {
  contractServices: ContractServiceCreateRequest[];
  contractClient: ClientCreateRequest[];
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

export interface ContractDetailResponse {
  id: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  propertyId: string;
  roomId: string;
  startDate: string;
  endDate?: string | null;
  rentAmountAgreed: string;
  depositAmountPaid: string;
  paymentDueDay: number;
  contractScanURL?: string | null;
  status: ContractStatus;
  notes?: string | null;
  room: {
    id: string;
    name: string;
    rentAmount: number;
    property: {
      id: string;
      name: string;
      address: string;
    };
  };
  contractClient: Array<{
    id: string;
    clientId: string;
    property: {
      id: string;
      fullName: string;
      phoneNumber: string;
      email?: string | null;
    };
    moveInDate?: string | null;
    moveOutDate?: string | null;
    isActiveInContract: boolean;
  }>;
  contractServices: Array<{
    id: string;
    serviceId: string;
    service: {
      id: string;
      name: string;
      icon: string;
    };
    price: string;
    isEnabled: boolean;
    notes?: string | null;
  }>;
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
  [ContractStatus.PENDING_START]: "Chờ bắt đầu",
  [ContractStatus.ACTIVE]: "Đang hiệu lực",
  [ContractStatus.ENDED]: "Đã kết thúc",
  [ContractStatus.TERMINATED_EARLY]: "Đã kết thúc sớm",
  [ContractStatus.EXPIRED]: "Hết hạn",
};

export const CONTRACT_STATUS_COLOR: Record<
  ContractStatus,
  { bg: string; color: string }
> = {
  [ContractStatus.PENDING_START]: { bg: "#F3F4F6", color: "#6B7280" },
  [ContractStatus.ACTIVE]: { bg: "#E9F9EF", color: "#34C759" },
  [ContractStatus.ENDED]: { bg: "#FFECEC", color: "#FF3B30" },
  [ContractStatus.TERMINATED_EARLY]: { bg: "#F3F4F6", color: "#6B7280" },
  [ContractStatus.EXPIRED]: { bg: "#FFF6E5", color: "#FF9500" },
};

export const CONTRACT_STATUS_ICON: Record<ContractStatus, string> = {
  [ContractStatus.PENDING_START]: "document-outline",
  [ContractStatus.ACTIVE]: "checkmark-circle",
  [ContractStatus.ENDED]: "time-outline",
  [ContractStatus.TERMINATED_EARLY]: "close-circle",
  [ContractStatus.EXPIRED]: "ellipse-outline",
};
