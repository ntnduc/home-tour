# Home Tour Backend

Backend API cho ứng dụng Home Tour được xây dựng bằng NestJS.

## Yêu cầu hệ thống

- Node.js (>= 20.11.0)
- PostgreSQL (>= 14)
- npm (>= 8.0.0)

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd home-tour/backend_v2
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file môi trường:
```bash
cp .env.example .env
```

4. Cập nhật các biến môi trường trong file `.env` theo cấu hình của bạn.

5. Tạo database:
```bash
createdb home_tour_db
```

## Chạy ứng dụng

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## Cấu trúc thư mục

```
src/
├── config/                 # Cấu hình ứng dụng
├── modules/               # Các module của ứng dụng
│   ├── auth/             # Module xác thực
│   ├── users/            # Module quản lý người dùng
│   └── ...
├── common/               # Shared resources
│   ├── decorators/      # Custom decorators
│   ├── filters/         # Exception filters
│   ├── guards/          # Guards
│   ├── interceptors/    # Interceptors
│   └── pipes/           # Custom pipes
├── database/            # Database configuration
│   ├── migrations/      # Database migrations
│   └── seeds/          # Database seeds
└── main.ts             # Entry point
```

## API Documentation

Sau khi chạy ứng dụng, bạn có thể truy cập API documentation tại:
```
http://localhost:3000/api
```

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

[MIT licensed](LICENSE)
