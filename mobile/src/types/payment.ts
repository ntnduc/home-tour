export interface Payment {
  id: number;
  roomId: number;
  roomName: string;
  tenantName: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  type: PaymentType;
  createdAt: string;
  paidAt?: string;
  note?: string;
}

export interface Invoice {
  id: number;
  roomId: number;
  roomName: string;
  tenantName: string;
  month: string; // Format: "YYYY-MM"
  totalAmount: number;
  rentAmount: number;
  serviceAmount: number;
  services: InvoiceService[];
  dueDate: string;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string;
}

export interface InvoiceService {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  unit?: string;
  amount: number;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export enum PaymentType {
  RENT = "RENT",
  DEPOSIT = "DEPOSIT",
  UTILITY = "UTILITY",
  OTHER = "OTHER",
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.PAID]: "Đã thanh toán",
  [PaymentStatus.OVERDUE]: "Quá hạn",
  [PaymentStatus.CANCELLED]: "Đã hủy",
};

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  [PaymentType.RENT]: "Tiền thuê",
  [PaymentType.DEPOSIT]: "Tiền cọc",
  [PaymentType.UTILITY]: "Tiện ích",
  [PaymentType.OTHER]: "Khác",
};

export const PAYMENT_STATUS_COLOR: Record<
  PaymentStatus,
  { bg: string; color: string }
> = {
  [PaymentStatus.PENDING]: { bg: "#FFF6E5", color: "#FF9500" },
  [PaymentStatus.PAID]: { bg: "#E9F9EF", color: "#34C759" },
  [PaymentStatus.OVERDUE]: { bg: "#FFECEC", color: "#FF3B30" },
  [PaymentStatus.CANCELLED]: { bg: "#F2F2F2", color: "#8E8E93" },
};
