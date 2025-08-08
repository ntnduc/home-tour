# Role-Based Access Control (RBAC) System Guide

## Tổng quan

Hệ thống RBAC (Role-Based Access Control) được thiết kế để quản lý quyền truy cập dựa trên vai trò người dùng trong ứng dụng quản lý phòng trọ. Hệ thống hỗ trợ multi-tenant architecture, cho phép một user có nhiều vai trò khác nhau trên các property khác nhau.

## Kiến trúc Database

### Database Relationship Diagram

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar phoneNumber
        varchar fullName
        timestamp createdAt
        timestamp updatedAt
    }

    PROPERTIES {
        uuid id PK
        varchar propertyName
        text description
        varchar ownerId FK
        timestamp createdAt
        timestamp updatedAt
    }

    ROLES {
        uuid id PK
        varchar roleName UK
        text description
        timestamp createdAt
        timestamp updatedAt
    }

    PERMISSIONS {
        uuid id PK
        varchar permissionName UK
        text description
        timestamp createdAt
        timestamp updatedAt
    }

    USER_ROLES {
        uuid userId PK,FK
        uuid roleId PK,FK
        uuid propertyId PK,FK
        timestamp assignedDate
    }

    ROLE_PERMISSIONS {
        uuid roleId PK,FK
        uuid permissionId PK,FK
    }

    USERS ||--o{ USER_ROLES : "has roles on properties"
    PROPERTIES ||--o{ USER_ROLES : "has users with roles"
    ROLES ||--o{ USER_ROLES : "assigned to users"
    ROLES ||--o{ ROLE_PERMISSIONS : "has permissions"
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "belongs to roles"
    USERS ||--o{ PROPERTIES : "owns"
```

### Database Schema

```sql
-- Bảng vai trò
CREATE TABLE "roles" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "roleName" varchar(100) UNIQUE NOT NULL,
  "description" text,
  "createdBy" varchar,
  "updatedBy" varchar,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

-- Bảng quyền hạn
CREATE TABLE "permissions" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "permissionName" varchar(100) UNIQUE NOT NULL,
  "description" text,
  "createdBy" varchar,
  "updatedBy" varchar,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

-- Bảng liên kết user-role-property (Multi-tenant)
CREATE TABLE "user_roles" (
  "userId" uuid NOT NULL,
  "roleId" uuid NOT NULL,
  "propertyId" uuid NOT NULL,
  "assignedDate" TIMESTAMP DEFAULT now(),
  PRIMARY KEY ("userId", "roleId", "propertyId"),
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE,
  FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE
);

-- Bảng liên kết role-permission
CREATE TABLE "role_permissions" (
  "roleId" uuid NOT NULL,
  "permissionId" uuid NOT NULL,
  PRIMARY KEY ("roleId", "permissionId"),
  FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE,
  FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE
);
```

## Vai trò và Quyền hạn

### Định nghĩa Roles

```typescript
enum Role {
  ADMIN = 'Admin',
  OWNER = 'Owner',
  PROPERTY_MANAGER = 'Property Manager',
  ACCOUNTANT = 'Accountant',
  TENANT = 'Tenant',
}
```

### Định nghĩa Permissions

```typescript
enum Permission {
  // Property permissions
  CREATE_PROPERTY = 'CREATE_PROPERTY',
  VIEW_PROPERTY = 'VIEW_PROPERTY',
  EDIT_PROPERTY = 'EDIT_PROPERTY',
  DELETE_PROPERTY = 'DELETE_PROPERTY',

  // Room permissions
  CREATE_ROOM = 'CREATE_ROOM',
  VIEW_ROOM = 'VIEW_ROOM',
  EDIT_ROOM = 'EDIT_ROOM',
  DELETE_ROOM = 'DELETE_ROOM',

  // User management
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_USERS = 'VIEW_USERS',

  // Financial permissions
  VIEW_FINANCIAL_REPORTS = 'VIEW_FINANCIAL_REPORTS',
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS',
}
```

### Ma trận Quyền hạn

| Role                 | Property  | Room      | Users       | Financial    |
| -------------------- | --------- | --------- | ----------- | ------------ |
| **Admin**            | Full CRUD | Full CRUD | Full CRUD   | Full Access  |
| **Owner**            | Full CRUD | Full CRUD | View/Manage | Full Access  |
| **Property Manager** | View/Edit | Full CRUD | View        | View Reports |
| **Accountant**       | View      | View      | View        | Full Access  |
| **Tenant**           | View      | View      | -           | View Own     |

## Cấu trúc Code

### 1. Entities

#### Role Entity

```typescript
@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  roleName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
```

#### Permission Entity

```typescript
@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  permissionName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];
}
```

#### UserRole Entity (Multi-tenant)

```typescript
@Entity('user_roles')
export class UserRole {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  roleId: string;

  @PrimaryColumn()
  propertyId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedDate: Date;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Properties, (property) => property.userRoles, {
    onDelete: 'CASCADE',
  })
  property: Properties;
}
```

### 2. Guards System

#### Authentication Flow

```
Request → StickAuthGuard → RolesGuard → PermissionsGuard → PropertyAccessGuard → Controller
```

#### Detailed Authorization Flow Diagram

```mermaid
graph TD
    A[Client Request] --> B{Has JWT Token?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D[StickAuthGuard]

    D --> E{Valid JWT?}
    E -->|No| F[401 Invalid Token]
    E -->|Yes| G[Extract User Info]
    G --> H[Set user in request]

    H --> I[RolesGuard]
    I --> J{Endpoint requires roles?}
    J -->|No| K[Skip Role Check]
    J -->|Yes| L{User has required role?}
    L -->|No| M[403 Forbidden - Role]
    L -->|Yes| N[Role Check Passed]

    K --> O[PermissionsGuard]
    N --> O
    O --> P{Endpoint requires permissions?}
    P -->|No| Q[Skip Permission Check]
    P -->|Yes| R{User has required permissions?}
    R -->|No| S[403 Forbidden - Permission]
    R -->|Yes| T[Permission Check Passed]

    Q --> U[PropertyAccessGuard]
    T --> U
    U --> V{Endpoint requires property access?}
    V -->|No| W[Skip Property Check]
    V -->|Yes| X{Extract Property ID}
    X --> Y{Property ID found?}
    Y -->|No| Z[403 Property ID Required]
    Y -->|Yes| AA{User is Admin?}
    AA -->|Yes| BB[Admin Access Granted]
    AA -->|No| CC{User has access to property?}
    CC -->|No| DD[403 No Property Access]
    CC -->|Yes| EE[Property Access Granted]

    W --> FF[Execute Controller Method]
    BB --> FF
    EE --> FF
    FF --> GG[Return Response]

    style A fill:#e1f5fe
    style FF fill:#c8e6c9
    style GG fill:#c8e6c9
    style C fill:#ffcdd2
    style F fill:#ffcdd2
    style M fill:#ffcdd2
    style S fill:#ffcdd2
    style Z fill:#ffcdd2
    style DD fill:#ffcdd2
```

#### RolesGuard

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const userProperties = user.properties || [];
    const userRoles = userProperties.map((property: any) => property.role);

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
```

#### PermissionsGuard

```typescript
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const userProperties = user.properties || [];
    const userPermissions: string[] = [];

    userProperties.forEach((property: any) => {
      if (property.permissions) {
        userPermissions.push(...property.permissions);
      }
    });

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
```

#### PropertyAccessGuard

```typescript
@Injectable()
export class PropertyAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirePropertyAccess = this.reflector.getAllAndOverride<boolean>(
      PROPERTY_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requirePropertyAccess) return true;

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) return false;

    // Extract propertyId từ request
    const propertyId =
      request.params?.id ||
      request.params?.propertyId ||
      request.query?.propertyId ||
      request.body?.propertyId ||
      request.body?.id;

    if (!propertyId) {
      throw new ForbiddenException(
        'Property ID is required for this operation',
      );
    }

    const userProperties = user.properties || [];

    // Admin có quyền truy cập tất cả properties
    const isAdmin = userProperties.some(
      (property: any) => property.role === 'Admin',
    );

    if (isAdmin) return true;

    // Kiểm tra quyền truy cập property cụ thể
    const hasAccess = userProperties.some(
      (property: any) => property.propertyId === propertyId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this property');
    }

    return true;
  }
}
```

### 3. Decorators

#### @Roles Decorator

```typescript
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Usage
@Roles(Role.ADMIN, Role.OWNER)
@Get('sensitive-data')
async getSensitiveData() {
  // Chỉ Admin và Owner mới truy cập được
}
```

#### @RequirePermissions Decorator

```typescript
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// Usage
@RequirePermissions(Permission.VIEW_PROPERTY, Permission.EDIT_PROPERTY)
@Put(':id')
async updateProperty() {
  // Cần có cả 2 quyền VIEW_PROPERTY và EDIT_PROPERTY
}
```

#### @RequirePropertyAccess Decorator

```typescript
export const PROPERTY_ACCESS_KEY = 'propertyAccess';
export const RequirePropertyAccess = () =>
  SetMetadata(PROPERTY_ACCESS_KEY, true);

// Usage
@RequirePropertyAccess()
@Get(':id')
async getProperty(@Param('id') id: string) {
  // Kiểm tra user có quyền truy cập property này không
}
```

## JWT Token Structure

### JWT Token Processing Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant AG as StickAuthGuard
    participant RG as RolesGuard
    participant PG as PermissionsGuard
    participant PAG as PropertyAccessGuard
    participant CTRL as Controller

    C->>AG: Request with JWT Token
    AG->>AG: Extract token from Authorization header
    AG->>AG: Verify JWT signature & expiration
    AG->>AG: Decode payload

    Note over AG: JWT Payload Structure:<br/>{<br/>  "sub": "user-id",<br/>  "properties": [<br/>    {<br/>      "propertyId": "prop-1",<br/>      "role": "Owner",<br/>      "permissions": ["VIEW_PROPERTY", ...]<br/>    }<br/>  ]<br/>}

    AG->>AG: Set user object in request
    AG->>RG: Pass request to RolesGuard

    RG->>RG: Get required roles from @Roles decorator
    RG->>RG: Extract user.properties[].role from JWT
    RG->>RG: Check if user has any required role
    alt User has required role
        RG->>PG: Pass to PermissionsGuard
    else User lacks required role
        RG->>C: 403 Forbidden (Role)
    end

    PG->>PG: Get required permissions from @RequirePermissions
    PG->>PG: Extract user.properties[].permissions from JWT
    PG->>PG: Check if user has all required permissions
    alt User has required permissions
        PG->>PAG: Pass to PropertyAccessGuard
    else User lacks required permissions
        PG->>C: 403 Forbidden (Permission)
    end

    PAG->>PAG: Check if @RequirePropertyAccess is set
    PAG->>PAG: Extract propertyId from request params/body
    PAG->>PAG: Check if user.properties contains propertyId
    alt User has property access OR is Admin
        PAG->>CTRL: Execute controller method
        CTRL->>C: Return response
    else User lacks property access
        PAG->>C: 403 Forbidden (Property Access)
    end
```

### Token Payload

```json
{
  "sub": "user-uuid",
  "phoneNumber": "0123456789",
  "properties": [
    {
      "propertyId": "property-uuid-1",
      "role": "Owner",
      "permissions": [
        "CREATE_PROPERTY",
        "EDIT_PROPERTY",
        "VIEW_PROPERTY",
        "DELETE_PROPERTY"
      ]
    },
    {
      "propertyId": "property-uuid-2",
      "role": "Property Manager",
      "permissions": ["VIEW_PROPERTY", "EDIT_ROOM", "CREATE_ROOM"]
    }
  ],
  "iat": 1733613600,
  "exp": 1733620800
}
```

## Sử dụng trong Controller

### Real-world Usage Scenarios

```mermaid
graph LR
    subgraph "Scenario 1: Property Owner"
        A1[Owner Login] --> B1[JWT with Owner Role]
        B1 --> C1[Access Own Properties]
        C1 --> D1[Full CRUD Operations]
    end

    subgraph "Scenario 2: Property Manager"
        A2[Manager Login] --> B2[JWT with Manager Role]
        B2 --> C2[Access Assigned Properties]
        C2 --> D2[Limited Operations]
    end

    subgraph "Scenario 3: Tenant"
        A3[Tenant Login] --> B3[JWT with Tenant Role]
        B3 --> C3[Access Own Room Only]
        C3 --> D3[View Only Operations]
    end

    subgraph "Scenario 4: Admin"
        A4[Admin Login] --> B4[JWT with Admin Role]
        B4 --> C4[Access All Properties]
        C4 --> D4[Super User Operations]
    end

    style A1 fill:#e3f2fd
    style A2 fill:#f3e5f5
    style A3 fill:#e8f5e8
    style A4 fill:#fff3e0
```

### Multi-tenant Access Control Example

```mermaid
graph TD
    subgraph "User: John Doe"
        U[User ID: john-123]
    end

    subgraph "Property A: Apartment Complex"
        PA[Property A]
        PA --> RA1[Role: Owner]
        RA1 --> PA1[Permissions: Full CRUD]
    end

    subgraph "Property B: Office Building"
        PB[Property B]
        PB --> RB1[Role: Property Manager]
        RB1 --> PB1[Permissions: View, Edit Rooms]
    end

    subgraph "Property C: Shopping Mall"
        PC[Property C]
        PC --> RC1[Role: Accountant]
        RC1 --> PC1[Permissions: View Financial Reports]
    end

    U -.-> PA
    U -.-> PB
    U -.-> PC

    subgraph "JWT Token Structure"
        JWT["{<br/>  'sub': 'john-123',<br/>  'properties': [<br/>    {<br/>      'propertyId': 'prop-a',<br/>      'role': 'Owner',<br/>      'permissions': ['CREATE_PROPERTY', 'VIEW_PROPERTY', ...]<br/>    },<br/>    {<br/>      'propertyId': 'prop-b',<br/>      'role': 'Property Manager',<br/>      'permissions': ['VIEW_PROPERTY', 'EDIT_ROOM', ...]<br/>    },<br/>    {<br/>      'propertyId': 'prop-c',<br/>      'role': 'Accountant',<br/>      'permissions': ['VIEW_FINANCIAL_REPORTS', ...]<br/>    }<br/>  ]<br/>}"]
    end

    style U fill:#e1f5fe
    style JWT fill:#f3e5f5
```

### Property Controller Example

```typescript
@Controller('api/property')
@UseGuards(StickAuthGaurd, RolesGuard, PermissionsGuard, PropertyAccessGuard)
export class PropertyController {
  @Get(':id')
  @Roles(
    Role.ADMIN,
    Role.OWNER,
    Role.PROPERTY_MANAGER,
    Role.ACCOUNTANT,
    Role.TENANT,
  )
  @RequirePermissions(Permission.VIEW_PROPERTY)
  @RequirePropertyAccess()
  async getProperty(@Param('id') id: string) {
    // Multi-layer security:
    // 1. User phải có một trong các roles được chỉ định
    // 2. User phải có permission VIEW_PROPERTY
    // 3. User phải có quyền truy cập property cụ thể này
    return this.propertyService.get(id);
  }

  @Put()
  @Roles(Role.ADMIN, Role.OWNER, Role.PROPERTY_MANAGER)
  @RequirePermissions(Permission.EDIT_PROPERTY)
  @RequirePropertyAccess()
  async updateProperty(@Body() dto: PropertyUpdateDto) {
    return this.propertyService.update(dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.OWNER)
  @RequirePermissions(Permission.DELETE_PROPERTY)
  @RequirePropertyAccess()
  async deleteProperty(@Param('id') id: string) {
    return this.propertyService.delete(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.OWNER)
  @RequirePermissions(Permission.CREATE_PROPERTY)
  // Không cần @RequirePropertyAccess() vì đang tạo mới
  async createProperty(@Body() dto: PropertyCreateDto) {
    return this.propertyService.create(dto);
  }
}
```

## RBAC Service

### Core Methods

```typescript
@Injectable()
export class RbacService {
  // Assign role to user for specific property
  async assignUserRole(
    userId: string,
    roleId: string,
    propertyId: string,
  ): Promise<void>;

  // Remove role from user for specific property
  async removeUserRole(
    userId: string,
    roleId: string,
    propertyId: string,
  ): Promise<void>;

  // Check if user has specific permission on property
  async hasPermission(
    userId: string,
    permission: string,
    propertyId: string,
  ): Promise<boolean>;

  // Generate user properties for JWT token
  async generateUserProperties(userId: string): Promise<UserProperty[]>;

  // Initialize default roles and permissions
  async initializeDefaultRolesAndPermissions(): Promise<void>;
}
```

## Security Features

### 1. Multi-Tenant Isolation

- Mỗi user chỉ có thể truy cập properties được assign
- Admin có quyền truy cập tất cả properties
- Property-level access control

### 2. Layered Security

- **Authentication**: JWT token validation
- **Authorization**: Role-based access
- **Permission**: Fine-grained permission control
- **Resource**: Property-specific access

### 3. Audit Trail

- Tất cả entities extend BaseEntity với `createdBy`, `updatedBy`
- Track assignment date trong UserRole
- Comprehensive logging

## Best Practices

### 1. Security

- ✅ Luôn validate JWT token
- ✅ Implement proper error handling
- ✅ Use HTTPS trong production
- ✅ Regular security audits

### 2. Performance

- ✅ Cache user permissions trong JWT
- ✅ Minimize database queries trong guards
- ✅ Use indexes trên foreign keys

### 3. Maintainability

- ✅ Centralized permission definitions
- ✅ Clear naming conventions
- ✅ Comprehensive documentation
- ✅ Unit tests cho guards

---

**Lưu ý:** Hệ thống RBAC này được thiết kế để scale với multi-tenant architecture và có thể mở rộng thêm roles/permissions khi cần thiết.
