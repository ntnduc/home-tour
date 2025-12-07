export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  DRAFT = 'DRAFT',
}

export enum InvoiceItemType {
  ROOM_RENT = 'ROOM_RENT',
  SERVICE_FEE = 'SERVICE_FEE',
  OTHER = 'OTHER',
}
