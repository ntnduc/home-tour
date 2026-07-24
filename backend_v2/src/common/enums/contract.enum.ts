export enum ContractStatus {
  // đợi bắt đầu
  PENDING_START = 'PENDING_START',
  // đang thực hiện
  ACTIVE = 'ACTIVE',
  // đã kết thúc
  ENDED = 'ENDED',
  // đã kết thúc sớm
  TERMINATED_EARLY = 'TERMINATED_EARLY',
  // kết thúc nhưng chưa thanh toán hết
  EXPIRED = 'EXPIRED',
  // nháp
  DRAFT = 'DRAFT',
}
