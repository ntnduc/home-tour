# Database Migration Guide

## Tổng quan

Hướng dẫn này giải thích cách cấu hình và sử dụng TypeORM migrations trong dự án NestJS để quản lý database schema.

## Cấu hình Database

### 1. TypeORM Configuration

File `typeorm.config.ts` chứa cấu hình chính cho TypeORM:

```typescript
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false, // ⚠️ Luôn để false trong production
});
```

### 2. Environment Variables

Tạo file `.env` với các biến môi trường:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=home_tour_db
```

### 3. TypeScript Configuration

File `tsconfig.json` được cấu hình để hỗ trợ absolute imports:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "src/*": ["src/*"]
    }
  }
}
```

## Migration Commands

### Package.json Scripts

```json
{
  "scripts": {
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli",
    "migration:generate": "npm run typeorm -- migration:generate -d typeorm.config.ts",
    "migration:run": "npm run typeorm -- migration:run -d typeorm.config.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d typeorm.config.ts"
  }
}
```

### Các lệnh Migration

#### 1. Tạo Migration mới

```bash
# Tạo migration từ thay đổi entities
npm run migration:generate src/database/migrations/MigrationName

# Tạo migration trống
npm run typeorm -- migration:create src/database/migrations/MigrationName
```

#### 2. Chạy Migration

```bash
# Chạy tất cả migrations chưa được thực thi
npm run migration:run

# Xem trạng thái migrations
npm run typeorm -- migration:show -d typeorm.config.ts
```

#### 3. Rollback Migration

```bash
# Rollback migration cuối cùng
npm run migration:revert
```

## Cấu trúc Migration

### Migration File Structure

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1234567890123 implements MigrationInterface {
  name = 'MigrationName1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // SQL commands để apply changes
    await queryRunner.query(`CREATE TABLE ...`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // SQL commands để revert changes
    await queryRunner.query(`DROP TABLE ...`);
  }
}
```

## Troubleshooting

### Lỗi thường gặp

#### 1. Module Resolution Error

```
Error: Cannot find module 'src/common/...'
```

**Giải pháp:**

- Đảm bảo `tsconfig-paths` được cài đặt
- Sử dụng `ts-node -r tsconfig-paths/register` trong scripts
- Cấu hình `paths` trong `tsconfig.json`

#### 2. Entity Import Error

```
Error during migration generation
```

**Giải pháp:**

- Sử dụng relative imports trong entities thay vì absolute imports
- Hoặc cấu hình TypeORM CLI với tsconfig-paths

#### 3. Database Connection Error

```
Error: Connection terminated unexpectedly
```

**Giải pháp:**

- Kiểm tra database đang chạy
- Xác minh thông tin kết nối trong `.env`
- Đảm bảo database tồn tại

### Best Practices

#### 1. Entity Design

```typescript
@Entity('table_name')
export class ExampleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => ParentEntity, (parent) => parent.children)
  parent: ParentEntity;

  @OneToMany(() => ChildEntity, (child) => child.parent)
  children: ChildEntity[];
}
```

#### 2. Migration Safety

- ⚠️ **Luôn backup database trước khi chạy migration**
- ✅ Test migrations trên development environment trước
- ✅ Review migration SQL trước khi apply
- ✅ Sử dụng transactions cho complex migrations

#### 3. Naming Conventions

- Migration files: `YYYYMMDDHHMMSS-DescriptiveName.ts`
- Tables: `snake_case`
- Columns: `camelCase` trong entity, `snake_case` trong database

## Migration History

### Recent Migrations

1. **UpdatePropertyOwnership** (1754585422320)
   - Tạo bảng RBAC: `roles`, `permissions`, `user_roles`, `role_permissions`
   - Thiết lập foreign key constraints
   - Hỗ trợ multi-tenant property access control

## Monitoring & Maintenance

### Database Schema Sync

```bash
# Kiểm tra schema differences
npm run typeorm -- schema:log -d typeorm.config.ts

# Sync schema (⚠️ chỉ dùng trong development)
npm run typeorm -- schema:sync -d typeorm.config.ts
```

### Performance Considerations

- Tạo indexes cho foreign keys
- Sử dụng partial indexes khi cần thiết
- Monitor query performance sau migrations

---

**Lưu ý:** Luôn test migrations thoroughly trước khi deploy lên production environment.
