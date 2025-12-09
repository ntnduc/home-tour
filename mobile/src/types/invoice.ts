import { ContractDetailResponse } from "./contract";

export interface Invoice {
  id: string;
  contractId: string;
  roomId: string;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  dueDate: Date;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

export interface InvoiceDetailResponse extends Omit<Invoice, "id"> {
  id?: string;
  isPrepaid: boolean;
  roomName: string;
  clientName?: string;
  propertyName?: string;
  contract?: ContractDetailResponse;
}

export interface InvoiceListResponse extends Invoice {}

export interface InvoiceCreateRequest
  extends Omit<Invoice, "id" | "createdAt" | "updatedAt"> {}

export interface InvoiceUpdateRequest
  extends Omit<Invoice, "id" | "createdAt" | "updatedAt"> {}

export enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
  DRAFT = "DRAFT",
}

export const INVOICE_STATUS_COLOR: Record<
  InvoiceStatus,
  { bg: string; color: string }
> = {
  [InvoiceStatus.DRAFT]: { bg: "#F3F4F6", color: "#6B7280" },
  [InvoiceStatus.PENDING]: { bg: "#FFF6E5", color: "#FF9500" },
  [InvoiceStatus.PAID]: { bg: "#E9F9EF", color: "#34C759" },
  [InvoiceStatus.PARTIALLY_PAID]: { bg: "#E3F2FD", color: "#1976D2" },
  [InvoiceStatus.OVERDUE]: { bg: "#FFECEC", color: "#FF3B30" },
  [InvoiceStatus.CANCELLED]: { bg: "#F2F2F2", color: "#8E8E93" },
};
