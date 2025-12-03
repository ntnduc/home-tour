# RBAC (Role-Based Access Control) Module

Hệ thống phân quyền dựa trên vai trò cho ứng dụng quản lý phòng trọ.

## Tổng quan

Module RBAC cung cấp hệ thống phân quyền linh hoạt với các tính năng:

- Quản lý vai trò (Roles)
- Quản lý quyền hạn (Permissions)
- Phân quyền theo từng nhà trọ (Property-based access)
- JWT token với thông tin roles và permissions
- Guards để bảo vệ API endpoints

## Cấu trúc

### Entities

- `RoleEntity`: Định nghĩa các vai trò
- `PermissionEntity`: Định nghĩa các quyền hạn
- `RolePermission`: Liên kết vai trò với quyền hạn
- `UserRole`: Liên kết user với vai trò theo từng property

### Enums

- `Role`: Admin, Owner, Property Manager, Accountant, Tenant
- `Permission`: Các quyền hạn cụ thể cho từng chức năng

### Guards

- `RolesGuard`: Kiểm tra vai trò của user
- `PermissionsGuard`: Kiểm tra quyền hạn cụ thể
- `PropertyAccessGuard`: Kiểm tra quyền truy cập property

### Decorators

- `@Roles(...)`: Yêu cầu vai trò cụ thể
- `@RequirePermissions(...)`: Yêu cầu quyền hạn cụ thể
- `@RequirePropertyAccess()`: Yêu cầu quyền truy cập property

## Cách sử dụng

### 1. Khởi tạo hệ thống

```typescript
// Gọi API để khởi tạo roles và permissions mặc định
POST / api / rbac / initialize;
```

### 2. Phân quyền cho user

```typescript
// Gán vai trò cho user trên một property cụ thể
POST /api/rbac/users/assign-role
{
  "userId": "user-uuid",
  "roleId": 2,
  "propertyId": "property-uuid"
}
```

### 3. Bảo vệ API endpoints

```typescript
@Controller('api/properties')
@UseGuards(StickAuthGaurd, RolesGuard, PermissionsGuard, PropertyAccessGuard)
export class PropertyController {
  @Get(':propertyId')
  @Roles(Role.OWNER, Role.PROPERTY_MANAGER)
  @RequirePermissions(Permission.VIEW_PROPERTY)
  @RequirePropertyAccess()
  async getProperty(@Param('id') propertyId: string) {
    // Chỉ user có role trên property này
    // và có quyền truy cập property này mới được phép
  }
}
```

**Cách PropertyAccessGuard hoạt động:**

1. **Extract Property ID**: Guard sẽ tìm `propertyId` từ:

   - `request.params.id` (cho routes như `/property/:id`)
   - `request.params.propertyId`
   - `request.query.propertyId`
   - `request.body.propertyId` hoặc `request.body.id`

2. **Kiểm tra quyền truy cập**:

   - **Admin**: Có quyền truy cập tất cả properties
   - **Các role khác**: Chỉ có quyền truy cập properties được assign trong JWT token

3. **Validation**: Nếu không tìm thấy propertyId hoặc user không có quyền → throw `ForbiddenException`

### 4. JWT Token Format

Token sẽ chứa thông tin roles theo format:

```json
{
  "sub": "user-uuid",
  "phoneNumber": "0123456789",
  "properties": [
    {
      "propertyId": "property-uuid-1",
      "role": "Owner",
      "permissions": ["CREATE_PROPERTY", "EDIT_PROPERTY", ...]
    },
    {
      "propertyId": "property-uuid-2",
      "role": "Property Manager",
      "permissions": ["VIEW_PROPERTY", "EDIT_ROOM", ...]
    }
  ],
  "iat": 1733613600,
  "exp": 1733620800
}
```

## Vai trò và Quyền hạn mặc định

### Admin

- Toàn quyền hệ thống
- Quản lý users, roles, permissions

### Owner (Chủ trọ)

- Tạo và quản lý properties
- Quản lý rooms, services
- Xem báo cáo tài chính
- Phân quyền cho nhân viên

### Property Manager (Quản lý nhà trọ)

- Quản lý rooms trong property được giao
- Tạo và quản lý contracts
- Ghi chỉ số điện nước
- Xử lý yêu cầu bảo trì

### Accountant (Kế toán)

- Tạo và quản lý hóa đơn
- Ghi nhận thanh toán
- Xem báo cáo tài chính

### Tenant (Người thuê)

- Xem contract và invoice của mình
- Thanh toán hóa đơn
- Tạo yêu cầu bảo trì

## API Endpoints

### Roles Management

- `GET /api/rbac/roles` - Lấy danh sách roles
- `POST /api/rbac/roles` - Tạo role mới
- `GET /api/rbac/roles/:id` - Lấy thông tin role

### Permissions Management

- `GET /api/rbac/permissions` - Lấy danh sách permissions
- `POST /api/rbac/permissions` - Tạo permission mới

### User Role Assignment

- `POST /api/rbac/users/assign-role` - Gán role cho user
- `DELETE /api/rbac/users/:userId/roles/:roleId/properties/:propertyId` - Xóa role
- `GET /api/rbac/users/:userId/roles` - Lấy roles của user
- `GET /api/rbac/users/:userId/permissions` - Lấy permissions của user

### Role Permission Assignment

- `POST /api/rbac/roles/assign-permission` - Gán permission cho role
- `DELETE /api/rbac/roles/:roleId/permissions/:permissionId` - Xóa permission khỏi role

## Migration

Chạy migration để tạo các bảng RBAC:

```bash
npm run migration:run
```

## Lưu ý

1. **Property-based Access**: Mỗi user có thể có vai trò khác nhau trên các property khác nhau
2. **JWT Token**: Chứa đầy đủ thông tin roles và permissions để tránh query database
3. **Token Revocation**: Khi thay đổi quyền, cần revoke token cũ và tạo token mới
4. **Performance**: Sử dụng indexes để tối ưu query performance
5. **Security**: Tất cả API đều được bảo vệ bằng authentication và authorization
