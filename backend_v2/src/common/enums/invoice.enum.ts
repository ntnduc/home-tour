export enum InvoiceStatus {
  // Đã tạo hóa đơn nhưng chưa thanh toán
  PENDING = 'PENDING',
  // Đã thanh toán
  PAID = 'PAID',
  // Đã thanh toán một phần
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  // Quá hạn thanh toán
  OVERDUE = 'OVERDUE',
  // Đã hủy
  CANCELLED = 'CANCELLED',
  // Bản nháp
  DRAFT = 'DRAFT',
}

export enum InvoiceItemType {
  ROOM_RENT = 'ROOM_RENT',
  SERVICE_FEE = 'SERVICE_FEE',
  OTHER = 'OTHER',
}

export const InvoiceTrackingStatusList = [
  InvoiceStatus.PENDING,
  InvoiceStatus.OVERDUE,
];
