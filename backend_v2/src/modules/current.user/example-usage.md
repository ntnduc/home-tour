# Hướng dẫn sử dụng CurrentUserService

## 1. Import module vào app.module.ts

```typescript
import { CurrentUserModule } from './modules/current.user';

@Module({
  imports: [
    // ... other modules
    CurrentUserModule,
  ],
})
export class AppModule {}
```

## 2. Sử dụng trong Controller

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../current.user';
import { StickAuthGaurd } from '../auth/jwt-auth.guard';

@Controller('api/example')
@UseGuards(StickAuthGaurd)
export class ExampleController {
  constructor(private readonly currentUserService: CurrentUserService) {}

  @Get('profile')
  async getProfile(@CurrentUser() userPayload: CurrentUserPayload) {
    // Lấy thông tin user đầy đủ
    const user = await this.currentUserService.getCurrentUser(userPayload);
    return user;
  }

  @Get('user-id')
  async getUserId(@CurrentUser() userPayload: CurrentUserPayload) {
    // Chỉ lấy user ID
    const userId = this.currentUserService.getCurrentUserId(userPayload);
    return { userId };
  }

  @Get('user-phone')
  async getUserPhone(@CurrentUser() userPayload: CurrentUserPayload) {
    // Chỉ lấy số điện thoại
    const phone = this.currentUserService.getCurrentUserPhone(userPayload);
    return { phone };
  }
}
```

## 3. Sử dụng trong Service

```typescript
import { Injectable } from '@nestjs/common';
import { CurrentUserService, CurrentUserPayload } from '../current.user';

@Injectable()
export class ExampleService {
  constructor(private readonly currentUserService: CurrentUserService) {}

  async createResource(userPayload: CurrentUserPayload, data: any) {
    // Lấy thông tin user hiện tại
    const currentUser =
      await this.currentUserService.getCurrentUser(userPayload);

    // Tạo resource với owner là user hiện tại
    const resource = {
      ...data,
      ownerId: currentUser.id,
      createdBy: currentUser.id,
    };

    return resource;
  }

  async checkOwnership(
    userPayload: CurrentUserPayload,
    resourceUserId: string,
  ) {
    // Kiểm tra xem user hiện tại có phải là chủ sở hữu không
    const isOwner = this.currentUserService.isOwner(
      userPayload,
      resourceUserId,
    );
    return isOwner;
  }

  async getUserWithFields(userPayload: CurrentUserPayload) {
    // Lấy user với các trường cụ thể
    const user = await this.currentUserService.getCurrentUserWithFields(
      userPayload,
      ['id', 'fullName', 'phone'],
    );
    return user;
  }
}
```

## 4. Cập nhật PropertyController với CurrentUserService

```typescript
import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../current.user';
import { CurrentUserService } from '../current.user';
import { StickAuthGaurd } from '../auth/jwt-auth.guard';

@Controller('api/property')
@UseGuards(StickAuthGaurd)
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Post()
  async create(
    @CurrentUser() userPayload: CurrentUserPayload,
    @Body() dto: PropertyCreateDto,
  ) {
    const currentUser =
      await this.currentUserService.getCurrentUser(userPayload);
    dto.ownerId = currentUser.id;
    return await this.propertyService.create(dto);
  }

  @Get('my-properties')
  async getMyProperties(@CurrentUser() userPayload: CurrentUserPayload) {
    const userId = this.currentUserService.getCurrentUserId(userPayload);
    return await this.propertyService.findByOwnerId(userId);
  }
}
```

## 5. Lợi ích của CurrentUserService

1. **Tái sử dụng**: Không cần lặp lại logic lấy user trong nhiều service
2. **Bảo mật**: Kiểm tra user tồn tại và active
3. **Linh hoạt**: Có thể lấy toàn bộ thông tin hoặc chỉ một số trường
4. **Dễ test**: Có thể mock CurrentUserService trong unit test
5. **Type safety**: Sử dụng TypeScript interface để đảm bảo type safety
