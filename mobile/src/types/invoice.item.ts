import { InvoiceStatus } from "./invoice";

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  amount: number;
  type: InvoiceItemType;
  helperValue?: number;
  contractServiceId?: string;
  propertyId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export enum InvoiceItemType {
  ROOM_RENT = "ROOM_RENT",
  SERVICE_FEE = "SERVICE_FEE",
  UTILITY_FEE = "UTILITY_FEE",
}

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  [InvoiceStatus.PENDING]: "Chờ thanh toán",
  [InvoiceStatus.PAID]: "Đã thanh toán",
  [InvoiceStatus.PARTIALLY_PAID]: "Thanh toán một phần",
  [InvoiceStatus.OVERDUE]: "Quá hạn",
  [InvoiceStatus.CANCELLED]: "Đã hủy",
  [InvoiceStatus.DRAFT]: "Nháp",
};
