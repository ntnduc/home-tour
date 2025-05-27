# Home Tour Backend

Backend cho ứng dụng Home Tour với xác thực bằng số điện thoại và OTP.

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- PostgreSQL
- Tài khoản Twilio (để gửi SMS OTP)

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd home-tour-backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env và cấu hình các biến môi trường:
```
# Server Configuration
PORT=3000

# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=home_tour
DB_SYNCHRONIZE=false
DB_LOGGING=true

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Database Migrations

### Tạo Database
```bash
# Đăng nhập vào PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE home_tour;

# Thoát
\q
```

### Quản lý Migrations

1. Tạo migration mới:
```bash
npm run migration:generate src/migrations/TenMigration
```

2. Chạy migrations:
```bash
npm run migration:run
```

3. Hoàn tác migration cuối cùng:
```bash
npm run migration:revert
```

### Cấu trúc Migrations

Mỗi file migration có hai phương thức chính:
- `up()`: Thực hiện các thay đổi
- `down()`: Hoàn tác các thay đổi

Ví dụ:
```typescript
export class CreateUserTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "isVerified" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_user_phoneNumber" UNIQUE ("phoneNumber"),
                CONSTRAINT "PK_user" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
```

## Chạy ứng dụng

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### 1. Yêu cầu OTP
- **URL**: `/api/auth/request-otp`
- **Method**: `POST`
- **Body**:
```json
{
  "phoneNumber": "+84123456789"
}
```

### 2. Xác thực OTP và Đăng ký/Đăng nhập
- **URL**: `/api/auth/verify-otp`
- **Method**: `POST`
- **Body**:
```json
{
  "phoneNumber": "+84123456789",
  "otp": "123456",
  "name": "Nguyễn Văn A" // Chỉ cần khi đăng ký mới
}
```

## Cấu trúc dự án

```
src/
  ├── controllers/
  │   └── AuthController.ts
  ├── entities/
  │   └── User.ts
  ├── migrations/
  │   └── 1709123456789-CreateUserTable.ts
  ├── services/
  │   └── OTPService.ts
  ├── config/
  │   └── database.ts
  └── index.ts
```

## Quy trình phát triển

1. Khi thay đổi entity:
   - Cập nhật file entity trong thư mục `entities/`
   - Tạo migration mới: `npm run migration:generate`
   - Kiểm tra file migration được tạo
   - Chạy migration: `npm run migration:run`

2. Khi cần rollback:
   - Chạy lệnh: `npm run migration:revert`
   - Hoặc sửa file migration và chạy lại

3. Khi deploy:
   - Đảm bảo tất cả migrations đã được commit
   - Chạy `npm run migration:run` trước khi start server 