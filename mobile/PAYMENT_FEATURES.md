# Tính Năng Quản Lý Thanh Toán - Home Tour App

## Tổng Quan

Đã thêm các tính năng quản lý thanh toán vào màn hình danh sách phòng, giúp chủ trọ theo dõi và quản lý việc thanh toán tiền phòng một cách hiệu quả.

## Các Tính Năng Mới

### 1. Thống Kê Thanh Toán
- **Component PaymentSummary**: Hiển thị tổng quan về tình trạng thanh toán
- **Thông tin hiển thị**:
  - Tổng số phòng có thanh toán
  - Số phòng chờ thanh toán
  - Số phòng quá hạn
  - Số phòng đã thanh toán
  - Tổng tiền cần thu

### 2. Bộ Lọc Thanh Toán
- **3 nút lọc**:
  - Tất cả: Hiển thị tất cả phòng
  - Chờ thanh toán: Chỉ hiển thị phòng có thanh toán đang chờ
  - Quá hạn: Chỉ hiển thị phòng có thanh toán quá hạn

### 3. Thông Tin Thanh Toán Trên Card Phòng
Mỗi card phòng hiển thị:
- **Trạng thái thanh toán**: Chờ thanh toán, Quá hạn, Đã thanh toán
- **Hạn thanh toán**: Ngày hạn chót với cảnh báo màu sắc
  - Xanh: Còn nhiều ngày
  - Cam: Còn ≤ 3 ngày
  - Đỏ: Quá hạn
- **Tổng hóa đơn**: Số tiền cần thanh toán
- **Số ngày còn lại/quá hạn**: Hiển thị chi tiết

### 4. Nút Hành Động Thanh Toán
Đối với phòng chờ thanh toán hoặc quá hạn:
- **Nút "Xem hóa đơn"**: Mở màn hình chi tiết hóa đơn
- **Nút "Thanh toán"**: Chuyển đến màn hình thanh toán

### 5. Màn Hình Chi Tiết Hóa Đơn (InvoiceDetailScreen)
**Thông tin hiển thị**:
- Thông tin phòng và người thuê
- Tháng tính tiền
- Hạn thanh toán
- Trạng thái thanh toán
- Chi tiết từng khoản:
  - Tiền thuê phòng
  - Các dịch vụ (điện, nước, wifi, gửi xe)
  - Tổng cộng
- Thông tin bổ sung (ngày tạo, ngày thanh toán)

**Chức năng**:
- **Nút "Xác nhận thanh toán"**: Cho phép chủ trọ xác nhận đã nhận thanh toán
- **Xác nhận 2 lần**: Hiển thị dialog xác nhận trước khi cập nhật trạng thái

## Cấu Trúc Dữ Liệu

### Types Mới (src/types/payment.ts)
```typescript
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
  month: string;
  totalAmount: number;
  rentAmount: number;
  serviceAmount: number;
  services: InvoiceService[];
  dueDate: string;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID", 
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}
```

### Components Mới
1. **PaymentSummary.tsx**: Component thống kê thanh toán
2. **InvoiceDetailScreen.tsx**: Màn hình chi tiết hóa đơn

## Cách Sử Dụng

### Cho Chủ Trọ:
1. **Xem tổng quan**: Màn hình chính hiển thị thống kê thanh toán
2. **Lọc phòng**: Sử dụng các nút lọc để xem phòng theo trạng thái thanh toán
3. **Xem chi tiết**: Nhấn "Xem hóa đơn" để xem chi tiết hóa đơn của phòng
4. **Xác nhận thanh toán**: Nhấn "Thanh toán" hoặc "Xác nhận thanh toán" để cập nhật trạng thái

### Tính Năng Tự Động:
- **Cảnh báo màu sắc**: Tự động đổi màu theo thời gian đến hạn
- **Tính toán số ngày**: Tự động tính số ngày còn lại hoặc quá hạn
- **Tổng hợp thống kê**: Tự động tính tổng tiền cần thu

## Màu Sắc và UI/UX

### Màu sắc trạng thái:
- **Chờ thanh toán**: Cam (#FF9500)
- **Quá hạn**: Đỏ (#FF3B30)  
- **Đã thanh toán**: Xanh (#34C759)
- **Đã hủy**: Xám (#8E8E93)

### Thiết kế responsive:
- Card phòng mở rộng để hiển thị thông tin thanh toán
- Nút hành động rõ ràng và dễ nhấn
- Thống kê trực quan với badge màu sắc
- Bộ lọc dạng tab dễ sử dụng

## Tích Hợp API (Tương Lai)

Các điểm cần tích hợp API:
1. **Lấy danh sách hóa đơn**: Thay thế mockInvoices
2. **Cập nhật trạng thái thanh toán**: Gọi API khi xác nhận thanh toán
3. **Tính toán hóa đơn**: Tự động tính từ dữ liệu thực tế
4. **Thông báo**: Push notification cho phòng sắp đến hạn

## Lưu Ý Kỹ Thuật

- Sử dụng TypeScript để type safety
- Responsive design cho các kích thước màn hình
- Performance optimization với FlatList
- Error handling cho các trường hợp null/undefined
- Accessibility support cho người dùng khuyết tật 