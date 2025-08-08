# Home Tour API v2 - Postman Collection Guide

## Tổng quan

Postman collection này chứa tất cả các API endpoints cho hệ thống quản lý phòng trọ Home Tour backend v2. Collection được tổ chức theo modules và bao gồm đầy đủ các chức năng authentication, authorization, và CRUD operations.

## Files được tạo

1. **Home_Tour_API.postman_collection.json** - Collection chính chứa tất cả API endpoints
2. **Home_Tour_Development.postman_environment.json** - Environment cho môi trường development
3. **Home_Tour_Production.postman_environment.json** - Environment cho môi trường production

## Cách import vào Postman

### 1. Import Collection
1. Mở Postman
2. Click **Import** button
3. Chọn file `Home_Tour_API.postman_collection.json`
4. Click **Import**

### 2. Import Environments
1. Click **Import** button
2. Chọn file `Home_Tour_Development.postman_environment.json`
3. Chọn file `Home_Tour_Production.postman_environment.json`
4. Click **Import**

### 3. Chọn Environment
1. Ở góc trên bên phải, chọn environment phù hợp:
   - **Home Tour Development** cho local development
   - **Home Tour Production** cho production

## Cấu trúc Collection

### 1. Authentication
- **Request OTP** - Yêu cầu mã OTP cho số điện thoại
- **Verify OTP** - Xác thực OTP và nhận temporary token
- **Register User** - Đăng ký user mới với temporary token
- **Refresh Token** - Làm mới access token
- **Check Login Status** - Kiểm tra trạng thái đăng nhập
- **Logout** - Đăng xuất

### 2. Users
- **Create User** - Tạo user mới
- **Get All Users** - Lấy danh sách tất cả users
- **Get User by ID** - Lấy thông tin user theo ID
- **Update User** - Cập nhật thông tin user
- **Delete User** - Xóa user

### 3. Property
- **Create Property** - Tạo property mới (Admin/Owner)
- **Get All Properties** - Lấy danh sách properties với phân trang
- **Get Property by ID** - Lấy chi tiết property
- **Update Property** - Cập nhật property (Admin/Owner/Manager)
- **Delete Property** - Xóa property (Admin/Owner)
- **Get Property Combo** - Lấy danh sách property cho dropdown
- **Test Property Endpoint** - Test endpoint không cần authentication

### 4. Rooms
- **Create Room** - Tạo phòng mới
- **Get All Rooms** - Lấy danh sách phòng với filter
- **Get Room by ID** - Lấy chi tiết phòng
- **Update Room** - Cập nhật thông tin phòng
- **Delete Room** - Xóa phòng

### 5. Location
- **Get Provinces** - Lấy danh sách tỉnh/thành phố
- **Get Districts by Province** - Lấy danh sách quận/huyện theo tỉnh
- **Get Wards by District** - Lấy danh sách phường/xã theo quận

### 6. RBAC Management
#### Roles
- **Create Role** - Tạo role mới (Admin only)
- **Get All Roles** - Lấy danh sách tất cả roles
- **Get Role by ID** - Lấy chi tiết role với permissions

#### Permissions
- **Create Permission** - Tạo permission mới (Admin only)
- **Get All Permissions** - Lấy danh sách tất cả permissions

#### Role-Permission Assignment
- **Assign Permission to Role** - Gán permission cho role
- **Remove Permission from Role** - Gỡ permission khỏi role

#### User-Role Assignment
- **Assign Role to User** - Gán role cho user cho property cụ thể
- **Remove Role from User** - Gỡ role khỏi user
- **Get User Roles** - Lấy danh sách roles của user
- **Get User Permissions** - Lấy danh sách permissions của user
- **Check Property Access** - Kiểm tra quyền truy cập property

#### System
- **Initialize System** - Khởi tạo roles và permissions mặc định

### 7. Services
- **Create Service** - Tạo dịch vụ mới
- **Get All Services** - Lấy danh sách tất cả dịch vụ
- **Get Service by ID** - Lấy chi tiết dịch vụ
- **Update Service** - Cập nhật dịch vụ
- **Delete Service** - Xóa dịch vụ
- **Get Default Selected Services** - Lấy dịch vụ được chọn mặc định

### 8. Test & Debug
- **Create Test Entity** - Tạo test entity
- **Get All Test Entities** - Lấy danh sách test entities
- **Create Test Mapping** - Tạo test mapping
- **Public Test Endpoint** - Test endpoint public (không cần auth)
- **Auth Only Test** - Test endpoint chỉ cần authentication
- **Roles Test** - Test endpoint cần roles (Admin/Owner)
- **Permissions Test** - Test endpoint cần permissions

## Environment Variables

### Development Environment
- **baseUrl**: `http://localhost:3000`
- **accessToken**: Token để authentication
- **refreshToken**: Token để refresh access token
- **tempToken**: Temporary token sau khi verify OTP
- **userId**: ID của user hiện tại
- **propertyId**: ID của property hiện tại
- **roomId**: ID của room hiện tại
- **roleId**: ID của role hiện tại
- **permissionId**: ID của permission hiện tại
- **serviceId**: ID của service hiện tại
- **testId**: ID của test entity hiện tại
- **provinceCode**: Mã tỉnh/thành phố (mặc định: "01")
- **districtCode**: Mã quận/huyện (mặc định: "001")
- **phoneNumber**: Số điện thoại để test (mặc định: "0123456789")

### Production Environment
Tương tự Development nhưng:
- **baseUrl**: `https://api.hometour.com` (cần cập nhật URL thực tế)
- **phoneNumber**: Để trống (cần nhập số thật)

## Workflow sử dụng

### 1. Authentication Flow
1. **Request OTP** với số điện thoại
2. **Verify OTP** để nhận `tempToken`
3. **Register User** với `tempToken` để tạo tài khoản và nhận `accessToken` + `refreshToken`
4. Sử dụng `accessToken` cho các API calls tiếp theo
5. Khi `accessToken` hết hạn, dùng **Refresh Token** để lấy token mới

### 2. Property Management Flow
1. **Initialize System** để tạo roles và permissions mặc định (Admin only)
2. **Create Property** để tạo property mới
3. **Assign Role to User** để gán quyền quản lý property cho users
4. **Create Room** để tạo phòng trong property
5. **Create Service** để tạo dịch vụ

### 3. RBAC Testing Flow
1. **Get All Roles** để xem các roles có sẵn
2. **Get All Permissions** để xem các permissions có sẵn
3. **Assign Permission to Role** để cấu hình permissions cho roles
4. **Assign Role to User** để gán role cho user cho property cụ thể
5. **Check Property Access** để kiểm tra quyền truy cập

## Lưu ý quan trọng

### Authentication
- Hầu hết các endpoints đều yêu cầu Bearer token trong header `Authorization`
- Token có thời gian hết hạn, cần refresh khi cần thiết
- Một số endpoints như Location và Test public không cần authentication

### Authorization (RBAC)
- Hệ thống sử dụng Role-Based Access Control
- Mỗi user có thể có nhiều roles khác nhau cho các properties khác nhau
- Permissions được gán cho roles, không trực tiếp cho users
- Property access được kiểm tra riêng biệt

### Roles mặc định
- **ADMIN**: Quyền cao nhất, quản lý toàn hệ thống
- **OWNER**: Chủ sở hữu property
- **PROPERTY_MANAGER**: Quản lý property
- **ACCOUNTANT**: Kế toán
- **TENANT**: Người thuê

### Error Handling
- API trả về HTTP status codes chuẩn
- Response body chứa thông tin chi tiết về lỗi
- Kiểm tra status code và message để debug

## Swagger Documentation

API cũng có Swagger documentation tại: `http://localhost:3000/api`

## Support

Nếu có vấn đề với API hoặc Postman collection, vui lòng:
1. Kiểm tra logs của server
2. Xem Swagger documentation
3. Kiểm tra RBAC permissions
4. Liên hệ team development
