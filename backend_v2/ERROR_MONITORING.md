# Hướng Dẫn Giám Sát và Phát Hiện Lỗi

## Tổng Quan

Tài liệu này mô tả cách phát hiện và giám sát lỗi trong ứng dụng, đặc biệt là các lỗi ẩn không được log ra.

## Các Cải Tiến Đã Thực Hiện

### 1. Logger trong Service

Tất cả các service giờ đã có Logger để log các hoạt động và lỗi:

```typescript
private readonly logger = new Logger(UploadFileService.name);

// Log debug
this.logger.debug(`Attempting to delete file entry with id: ${id}`);

// Log warning
this.logger.warn(`File entry not found with id: ${id}`);

// Log error với stack trace
this.logger.error(
  `Failed to delete file entry with id: ${id}`,
  error instanceof Error ? error.stack : String(error),
);
```

### 2. Exception Filter với Logging

`AllExceptionFilter` giờ đã log tất cả các lỗi với context đầy đủ:
- HTTP method và URL
- Request body, query, params
- User ID (nếu có)
- Stack trace cho lỗi server
- Exception type và message

### 3. Try-Catch với Error Handling

Tất cả các method quan trọng đã được bọc trong try-catch để:
- Log lỗi với context
- Re-throw exceptions đã biết
- Wrap unknown errors thành BadRequestException

## Cách Phát Hiện Lỗi Trong Development

### 1. Xem Logs trong Console

Khi chạy `npm run start:dev`, tất cả logs sẽ hiển thị trong console:
- `logger.debug()` - Chỉ hiển thị khi LOG_LEVEL=debug
- `logger.log()` - Hiển thị thông tin bình thường
- `logger.warn()` - Cảnh báo (màu vàng)
- `logger.error()` - Lỗi (màu đỏ với stack trace)

### 2. Sử dụng Environment Variables

Thiết lập log level trong `.env`:

```env
LOG_LEVEL=debug  # debug, log, warn, error
```

### 3. Kiểm Tra Logs File (nếu có)

Nếu bạn setup file logging, kiểm tra log files:
- `logs/error.log` - Chỉ lỗi
- `logs/combined.log` - Tất cả logs

## Cách Phát Hiện Lỗi Trong Production

### 1. Centralized Logging Service

#### Option A: Sử dụng Winston với File Transport

Cài đặt:
```bash
npm install winston nest-winston
```

Cấu hình trong `main.ts`:
```typescript
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

const app = await NestFactory.create(AppModule, { logger });
```

#### Option B: Sử dụng Cloud Logging Services

**Sentry** (Recommended):
```bash
npm install @sentry/node @sentry/nestjs
```

Cấu hình trong `main.ts`:
```typescript
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
```

**Datadog**:
```bash
npm install dd-trace
```

**New Relic**:
```bash
npm install newrelic
```

### 2. Health Check Endpoint

Tạo health check endpoint để monitor application:

```typescript
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

### 3. Database Query Monitoring

Monitor slow queries và errors:

```typescript
// Trong typeorm.config.ts
logging: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'query'] : ['error'],
logger: 'advanced-console',
maxQueryExecutionTime: 1000, // Log queries > 1s
```

### 4. Process Monitoring

Sử dụng PM2 hoặc Docker health checks:

**PM2**:
```bash
npm install -g pm2
pm2 start dist/main.js --name api
pm2 logs api
pm2 monit
```

**Docker Health Check**:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1
```

### 5. Error Alerting

#### Email Alerts
Sử dụng nodemailer để gửi email khi có lỗi nghiêm trọng:

```typescript
// Trong exception filter
if (status >= 500) {
  // Send email alert
  await this.emailService.sendErrorAlert({
    error: message,
    stack: exception.stack,
    context: { method, url, userId },
  });
}
```

#### Slack/Discord Webhooks
Gửi alerts đến Slack/Discord:

```typescript
async sendSlackAlert(error: any) {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: `🚨 Production Error: ${error.message}`,
    attachments: [{
      color: 'danger',
      fields: [
        { title: 'Error', value: error.message },
        { title: 'Stack', value: error.stack },
      ],
    }],
  });
}
```

## Best Practices

### 1. Log Levels

- **DEBUG**: Thông tin chi tiết cho debugging
- **LOG**: Thông tin bình thường về flow
- **WARN**: Cảnh báo nhưng không phải lỗi
- **ERROR**: Lỗi cần được xử lý

### 2. Structured Logging

Luôn log với context:
```typescript
this.logger.error('Failed to delete file', {
  fileId: id,
  userId: user.id,
  error: error.message,
  stack: error.stack,
});
```

### 3. Error Context

Luôn bao gồm:
- User ID (nếu có)
- Request ID (correlation ID)
- Timestamp
- Request details (method, URL, body)
- Error stack trace

### 4. Sensitive Data

KHÔNG log:
- Passwords
- API keys
- Credit card numbers
- Personal identifiable information (PII)

### 5. Performance Monitoring

Monitor:
- Response times
- Database query times
- Memory usage
- CPU usage
- Error rates

## Checklist cho Production

- [ ] Setup centralized logging (Winston/Sentry/Datadog)
- [ ] Configure log rotation
- [ ] Setup error alerting (Email/Slack)
- [ ] Implement health check endpoint
- [ ] Monitor database performance
- [ ] Setup process monitoring (PM2/Docker)
- [ ] Configure log retention policy
- [ ] Test error alerting system
- [ ] Document error codes và meanings
- [ ] Setup dashboard để visualize errors

## Debugging Tips

### 1. Reproduce Locally

Khi có lỗi trong production:
1. Check logs để lấy context
2. Reproduce với cùng data trong local
3. Debug với breakpoints

### 2. Add Temporary Logging

Nếu cần thêm logging tạm thời:
```typescript
this.logger.debug('TEMP DEBUG', { data: JSON.stringify(complexObject) });
```

### 3. Use Correlation IDs

Thêm correlation ID để track requests:
```typescript
// Trong interceptor
const correlationId = uuidv4();
req['correlationId'] = correlationId;
this.logger.log('Request started', { correlationId });
```

## Tài Liệu Tham Khảo

- [NestJS Logger](https://docs.nestjs.com/techniques/logger)
- [Winston Documentation](https://github.com/winstonjs/winston)
- [Sentry NestJS](https://docs.sentry.io/platforms/javascript/guides/nestjs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
