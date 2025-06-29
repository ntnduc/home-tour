# Hướng Dẫn Sử Dụng Tính Năng Quản Lý Hợp Đồng

## Cách Xem Danh Sách Hợp Đồng

### 1. Từ Màn Hình Danh Sách Phòng (RoomListScreen)
- Mở ứng dụng và vào tab "Phòng"
- Ở góc trên bên phải, bạn sẽ thấy nút "Hợp đồng" với icon document
- Nhấn vào nút này để mở modal hiển thị danh sách tất cả hợp đồng

### 2. Từ Màn Hình Dashboard
- Vào tab "Trang chủ"
- Trong phần "Thao tác nhanh", nhấn vào card "Hợp đồng"
- Sẽ chuyển đến màn hình danh sách hợp đồng

### 3. Từ Màn Hình Chi Tiết Phòng
- Khi xem chi tiết một phòng có hợp đồng
- Các nút "Xem hợp đồng", "Gia hạn", "Kết thúc" sẽ hiển thị
- Nhấn "Xem hợp đồng" để xem chi tiết hợp đồng của phòng đó

## Tính Năng Có Sẵn

### Xem Danh Sách Hợp Đồng
- Hiển thị tất cả hợp đồng với thông tin cơ bản
- Thống kê số lượng hợp đồng theo trạng thái
- Tìm kiếm hợp đồng theo tên người thuê, tên phòng
- Lọc theo trạng thái: Đang hoạt động, Hết hạn, Đã kết thúc

### Xem Chi Tiết Hợp Đồng
- Thông tin đầy đủ về hợp đồng
- Thông tin người thuê
- Thời hạn hợp đồng và thời gian còn lại
- Thông tin thanh toán và dịch vụ
- Lịch sử hợp đồng

### Quản Lý Hợp Đồng
- **Tạo hợp đồng mới**: Từ phòng trống
- **Gia hạn hợp đồng**: Khi hợp đồng sắp hết hạn
- **Kết thúc hợp đồng**: Với lý do và thông tin hoàn trả

## Cấu Trúc Dữ Liệu

### Trạng Thái Hợp Đồng
- `ACTIVE`: Đang hoạt động
- `EXPIRED`: Hết hạn
- `TERMINATED`: Đã kết thúc

### Thông Tin Hợp Đồng
- Thông tin phòng và tòa nhà
- Thông tin người thuê (tên, SĐT, email, CMND, địa chỉ)
- Thời hạn thuê (ngày bắt đầu, ngày kết thúc)
- Thông tin thanh toán (tiền thuê, tiền cọc)
- Dịch vụ bao gồm
- Ghi chú và lịch sử

## Giao Diện Người Dùng

### Thiết Kế Hiện Đại
- Sử dụng màu sắc trực quan cho từng trạng thái
- Icon rõ ràng cho từng hành động
- Layout responsive và thân thiện
- Loading state và thông báo lỗi/thành công

### Trải Nghiệm Người Dùng
- Navigation dễ dàng giữa các màn hình
- Validation form đầy đủ
- Xác nhận trước khi thực hiện hành động quan trọng
- Workflow rõ ràng và logic

## Cách Sử Dụng

1. **Xem danh sách hợp đồng**: Nhấn nút "Hợp đồng" từ màn hình phòng
2. **Tạo hợp đồng mới**: Chọn phòng trống → Nhấn "Tạo hợp đồng"
3. **Xem chi tiết**: Nhấn vào hợp đồng trong danh sách
4. **Gia hạn**: Nhấn nút "Gia hạn" khi hợp đồng sắp hết hạn
5. **Kết thúc**: Nhấn nút "Kết thúc" và nhập lý do

## Lưu Ý

- Hợp đồng chỉ có thể được tạo cho phòng trống
- Chỉ có thể gia hạn hợp đồng đang hoạt động và sắp hết hạn
- Việc kết thúc hợp đồng sẽ chuyển phòng về trạng thái trống
- Tất cả thao tác đều có xác nhận để tránh lỗi 