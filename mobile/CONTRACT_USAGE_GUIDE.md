# Hướng Dẫn Sử Dụng Tính Năng Hợp Đồng

## 🎯 **Cách Xem Danh Sách Hợp Đồng**

### **1. Từ Tab Navigation**
- Ứng dụng hiện có **6 tab chính**:
  - **Trang chủ**: Dashboard với thống kê tổng quan
  - **Tài sản**: Quản lý tòa nhà và tài sản
  - **Phòng**: Danh sách phòng và quản lý thuê
  - **Hợp đồng**: 🆕 **TAB MỚI** - Xem tất cả hợp đồng
  - **Báo cáo**: Thống kê và báo cáo
  - **Cá nhân**: Thông tin cá nhân và cài đặt

- **Nhấn vào tab "Hợp đồng"** để xem danh sách tất cả hợp đồng

### **2. Từ Màn Hình Danh Sách Phòng**
- Vào tab **"Phòng"**
- Nhấn nút **"Hợp đồng"** ở góc trên bên phải
- Modal sẽ hiển thị danh sách hợp đồng với thống kê

## 📱 **Tính Năng Đã Tích Hợp**

### **✅ Tab Hợp Đồng Mới**
- Hiển thị tất cả hợp đồng với thống kê theo trạng thái
- Tìm kiếm và lọc hợp đồng
- Giao diện hiện đại với màu sắc trực quan

### **✅ Xem Chi Tiết Hợp Đồng**
- Thông tin đầy đủ về hợp đồng và người thuê
- Thời hạn và thời gian còn lại
- Thông tin thanh toán và dịch vụ

### **✅ Quản Lý Hợp Đồng**
- **Tạo hợp đồng mới** từ phòng trống
- **Gia hạn hợp đồng** khi sắp hết hạn  
- **Kết thúc hợp đồng** với lý do và hoàn trả

### **✅ Giao Diện Chuyên Nghiệp**
- Thiết kế hiện đại với màu sắc phân biệt trạng thái
- Nút action gọn gàng, dễ sử dụng
- Validation form đầy đủ
- Loading state và thông báo rõ ràng

## 🔄 **Cấu Trúc Đã Khôi Phục**

### **TabNavigator Ban Đầu**
- ✅ **Trang chủ**: Dashboard với thống kê tổng quan ban đầu
- ✅ **Tài sản**: Quản lý tòa nhà (TenantListScreen)
- ✅ **Phòng**: Danh sách phòng (RoomListScreen)
- ✅ **Hợp đồng**: 🆕 Danh sách hợp đồng (ContractListScreen)
- ✅ **Báo cáo**: Báo cáo thống kê (ReportScreen)
- ✅ **Cá nhân**: Thông tin cá nhân (ProfileScreen)

### **Dashboard Ban Đầu**
- ✅ Thống kê tổng quan: Tài sản, Tổng phòng, Đã thuê, Tháng này
- ✅ Thao tác nhanh: Thêm tài sản, Thêm người thuê
- ✅ Hoạt động gần đây

## 🎨 **Thiết Kế UI/UX**

### **Màu Sắc Trực Quan**
- **Xanh lá**: Đang hoạt động
- **Cam**: Hết hạn
- **Đỏ**: Đã kết thúc
- **Xanh dương**: Tổng quan

### **Icon Rõ Ràng**
- 📄 Document: Hợp đồng
- 👥 Person: Người thuê
- 🏢 Building: Tòa nhà
- 📊 Chart: Báo cáo

### **Layout Responsive**
- Thiết kế thân thiện với mobile
- Navigation dễ dàng giữa các tab
- Modal và bottom sheet cho các hành động

## 📋 **Cách Sử Dụng**

1. **Xem danh sách hợp đồng**: 
   - Nhấn tab **"Hợp đồng"** hoặc nút "Hợp đồng" từ màn hình phòng

2. **Tạo hợp đồng mới**: 
   - Chọn phòng trống → Nhấn "Tạo hợp đồng"

3. **Xem chi tiết**: 
   - Nhấn vào hợp đồng trong danh sách

4. **Gia hạn**: 
   - Nhấn nút "Gia hạn" khi hợp đồng sắp hết hạn

5. **Kết thúc**: 
   - Nhấn nút "Kết thúc" và nhập lý do

## ⚠️ **Lưu Ý**

- Hợp đồng chỉ có thể được tạo cho phòng trống
- Chỉ có thể gia hạn hợp đồng đang hoạt động và sắp hết hạn
- Việc kết thúc hợp đồng sẽ chuyển phòng về trạng thái trống
- Tất cả thao tác đều có xác nhận để tránh lỗi

## 🎉 **Kết Quả**

Bây giờ bạn có thể:
- ✅ Xem danh sách hợp đồng từ tab riêng biệt
- ✅ Quản lý hợp đồng một cách chuyên nghiệp
- ✅ Giữ nguyên cấu trúc TabNavigator ban đầu
- ✅ Sử dụng Dashboard với thống kê tổng quan như cũ
- ✅ Truy cập hợp đồng từ nhiều nơi khác nhau

**Tính năng hợp đồng đã được tích hợp hoàn chỉnh vào ứng dụng với giao diện đẹp và trải nghiệm người dùng tốt!** 🚀 