# BaseController with Permission Node ID

## Overview

BaseController now supports automatic permission management through Permission Node IDs. This allows you to easily apply CRUD permissions to your controllers without manually adding permission decorators to each method.

## Features

1. **Permission Node ID Support**: Pass a permission node ID to automatically generate CRUD permissions
2. **Auto CRUD Permissions**: Use `@AutoCrudPermissions` decorator to automatically apply all CRUD permissions
3. **Individual Permission Decorators**: Use specific permission decorators for fine-grained control
4. **Flexible Configuration**: Mix automatic and manual permission configuration

## Usage

### 1. Basic Usage with Auto CRUD Permissions

```typescript
import { Controller } from '@nestjs/common';
import { BaseController } from 'src/common/base/crud/base.controller';
import { AutoCrudPermissions } from 'src/common/decorators/crud-permissions.decorator';

@Controller('api/properties')
@AutoCrudPermissions('PROPERTY') // Automatically applies PROPERTY.* permissions
export class PropertyController extends BaseController<...> {
  constructor(service: PropertyService) {
    super(
      service,
      PropertyDetailDto,
      PropertyListDto,
      PropertyCreateDto,
      PropertyUpdateDto,
      'PROPERTY', // Permission node ID
    );
  }
}
```

This automatically applies:

- `PROPERTY.CREATE` to `create()` method
- `PROPERTY.VIEW` to `get()` and `getAll()` methods
- `PROPERTY.EDIT` to `update()` method
- `PROPERTY.DELETE` to `delete()` method

### 2. Individual Permission Decorators

```typescript
import { CreatePermission, ViewPermission, EditPermission, DeletePermission } from 'src/common/decorators/crud-permissions.decorator';

@Controller('api/rooms')
export class RoomController extends BaseController<...> {
  constructor(service: RoomService) {
    super(service, RoomDetailDto, RoomListDto, RoomCreateDto, RoomUpdateDto, 'ROOM');
  }

  @CreatePermission('ROOM')
  async create(req: Request, dto: RoomCreateDto) {
    return super.create(req, dto);
  }

  @ViewPermission('ROOM')
  async get(id: string) {
    return super.get(id);
  }

  @EditPermission('ROOM')
  async update(dto: RoomUpdateDto) {
    return super.update(dto);
  }

  @DeletePermission('ROOM')
  async delete(id: string) {
    return super.delete(id);
  }
}
```

### 3. No Permissions (Public Controller)

```typescript
@Controller('api/public')
export class PublicController extends BaseController<...> {
  constructor(service: PublicService) {
    super(
      service,
      PublicDetailDto,
      PublicListDto,
      PublicCreateDto,
      PublicUpdateDto,
      null, // No permission node ID
    );
  }
  // All methods are public (no permission checks)
}
```

### 4. Mixed Permissions

```typescript
@Controller('api/mixed')
export class MixedController extends BaseController<...> {
  constructor(service: MixedService) {
    super(service, DetailDto, ListDto, CreateDto, UpdateDto, 'SERVICE');
  }

  // Requires SERVICE.CREATE permission
  @CreatePermission('SERVICE')
  async create(req: Request, dto: CreateDto) {
    return super.create(req, dto);
  }

  // Public method (no permission required)
  async getAll(query: any) {
    return super.getAll(query);
  }

  // Requires SERVICE.VIEW permission
  @ViewPermission('SERVICE')
  async get(id: string) {
    return super.get(id);
  }
}
```

### 5. Custom Methods with Permissions

```typescript
@Controller('api/properties')
@AutoCrudPermissions('PROPERTY')
export class PropertyController extends BaseController<...> {
  constructor(service: PropertyService) {
    super(service, DetailDto, ListDto, CreateDto, UpdateDto, 'PROPERTY');
  }

  // Custom method with specific permission
  @Get('combo')
  @ViewPermission('PROPERTY')
  async getComboProperty() {
    return this.service.getComboProperty();
  }

  // Custom method with manage permission
  @Post('bulk-update')
  @ManagePermission('PROPERTY')
  async bulkUpdate(@Body() data: any) {
    return this.service.bulkUpdate(data);
  }
}
```

## Available Permission Decorators

- `@AutoCrudPermissions(nodeId)`: Automatically applies all CRUD permissions
- `@CreatePermission(nodeId)`: Applies CREATE permission
- `@ViewPermission(nodeId)`: Applies VIEW permission
- `@EditPermission(nodeId)`: Applies EDIT permission
- `@DeletePermission(nodeId)`: Applies DELETE permission
- `@ManagePermission(nodeId)`: Applies MANAGE permission (parent permission)

## Permission Node IDs

Common permission node IDs based on the permission tree:

- `'SYSTEM'`: System management permissions
- `'PROPERTY'`: Property management permissions
- `'ROOM'`: Room management permissions
- `'CONTRACT'`: Contract management permissions
- `'SERVICE'`: Service management permissions
- `'INVOICE'`: Invoice management permissions
- `'MAINTENANCE'`: Maintenance management permissions
- `'USER'`: User management permissions
- `'REPORT'`: Report management permissions
- `'TENANT'`: Tenant-specific permissions

## Generated Permissions

For each permission node ID, the following permissions are generated:

- `{NODE_ID}.CREATE`: Create new entities
- `{NODE_ID}.VIEW`: View entities
- `{NODE_ID}.EDIT`: Edit existing entities
- `{NODE_ID}.DELETE`: Delete entities
- `{NODE_ID}.MANAGE`: Manage all operations (parent permission)

## Best Practices

1. **Use AutoCrudPermissions for standard controllers**: Most controllers should use `@AutoCrudPermissions` for consistency
2. **Use individual decorators for custom logic**: When you need different permissions for different methods
3. **Set permission node ID to null for public controllers**: When no authentication is required
4. **Use MANAGE permission for administrative operations**: For bulk operations or complex business logic
5. **Be consistent with permission node IDs**: Use the same node ID throughout related controllers and services

## Migration from Manual Permissions

If you have existing controllers with manual permission decorators:

1. Remove individual `@RequirePermissions` decorators
2. Add `@AutoCrudPermissions(nodeId)` to the controller class
3. Pass the permission node ID to the BaseController constructor
4. Test that permissions work as expected

Example migration:

```typescript
// Before
@Controller('api/rooms')
export class RoomController extends BaseController<...> {
  @RequirePermissions(Permission.CREATE_ROOM)
  async create(req: Request, dto: RoomCreateDto) {
    return super.create(req, dto);
  }

  @RequirePermissions(Permission.VIEW_ROOM)
  async get(id: string) {
    return super.get(id);
  }
}

// After
@Controller('api/rooms')
@AutoCrudPermissions('ROOM')
export class RoomController extends BaseController<...> {
  constructor(service: RoomService) {
    super(service, DetailDto, ListDto, CreateDto, UpdateDto, 'ROOM');
  }
  // Methods inherit permissions automatically
}
```
