export enum RoomStatus {
  // Phòng trống
  AVAILABLE = 'AVAILABLE',
  // Phòng đã có người thuê
  OCCUPIED = 'OCCUPIED',
  // Phòng đang bảo trì
  MAINTENANCE = 'MAINTENANCE',
  // Phòng đang chờ đặt cọc
  PENDING_DEPOSIT = 'PENDING_DEPOSIT',
  // Phòng không thể sử dụng
  UNAVAILABLE = 'UNAVAILABLE',
}
