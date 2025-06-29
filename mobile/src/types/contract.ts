export interface Contract {
  id: number;
  roomId: number;
  roomName: string;
  buildingName: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  tenantIdCard: string;
  tenantAddress: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: ContractStatus;
  createdAt: string;
  signedAt?: string;
  terminatedAt?: string;
  terminationReason?: string;
  notes?: string;
  services: ContractService[];
}

export interface ContractService {
  id: number;
  name: string;
  price: number;
  calculationMethod: string;
  isIncluded: boolean;
}

export interface ContractCreateRequest {
  roomId: number;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  tenantIdCard: string;
  tenantAddress: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  services: ContractService[];
  notes?: string;
}

export enum ContractStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  TERMINATED = "TERMINATED",
  PENDING_SIGNATURE = "PENDING_SIGNATURE",
}

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: "Nháp",
  [ContractStatus.ACTIVE]: "Đang hiệu lực",
  [ContractStatus.EXPIRED]: "Hết hạn",
  [ContractStatus.TERMINATED]: "Đã kết thúc",
  [ContractStatus.PENDING_SIGNATURE]: "Chờ ký",
};

export const CONTRACT_STATUS_COLOR: Record<
  ContractStatus,
  { bg: string; color: string }
> = {
  [ContractStatus.DRAFT]: { bg: "#F3F4F6", color: "#6B7280" },
  [ContractStatus.ACTIVE]: { bg: "#E9F9EF", color: "#34C759" },
  [ContractStatus.EXPIRED]: { bg: "#FFECEC", color: "#FF3B30" },
  [ContractStatus.TERMINATED]: { bg: "#F3F4F6", color: "#6B7280" },
  [ContractStatus.PENDING_SIGNATURE]: { bg: "#FFF6E5", color: "#FF9500" },
};

export const CONTRACT_STATUS_ICON: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: "document-outline",
  [ContractStatus.ACTIVE]: "checkmark-circle",
  [ContractStatus.EXPIRED]: "time-outline",
  [ContractStatus.TERMINATED]: "close-circle",
  [ContractStatus.PENDING_SIGNATURE]: "ellipse-outline",
};
