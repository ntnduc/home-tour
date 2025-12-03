# Utility Functions

Thư mục này chứa các hàm utility có thể sử dụng ở nhiều nơi trong project.

## Cách sử dụng

### Import tất cả utilities

```typescript
import {
  toSlug,
  isValidEmail,
  formatVietnameseDate,
  isMethodOverridden,
} from '../../../common/utils';
```

### Import từng file riêng lẻ

```typescript
import { toSlug } from '../../../common/utils/string.utils';
import { isValidEmail } from '../../../common/utils/validation.utils';
import { formatVietnameseDate } from '../../../common/utils/date.utils';
import { isMethodOverridden } from '../../../common/utils/object.utils';
```

## Các nhóm utility functions

### 1. String Utils (`string.utils.ts`)

- `removeAccents(text: string)`: Loại bỏ dấu tiếng Việt
- `toSlug(text: string)`: Chuyển đổi text thành slug format
- `capitalizeWords(text: string)`: Viết hoa chữ cái đầu mỗi từ
- `generateRandomString(length: number)`: Tạo chuỗi ngẫu nhiên
- `isEmptyOrWhitespace(text: string)`: Kiểm tra chuỗi rỗng hoặc chỉ có khoảng trắng

### 2. Date Utils (`date.utils.ts`)

- `toISOString(date: Date)`: Chuyển đổi date thành ISO string
- `getCurrentTimestamp()`: Lấy timestamp hiện tại
- `addDays(date: Date, days: number)`: Thêm số ngày vào date
- `isToday(date: Date)`: Kiểm tra date có phải hôm nay không
- `formatVietnameseDate(date: Date)`: Format date theo định dạng Việt Nam (dd/mm/yyyy)

### 3. Validation Utils (`validation.utils.ts`)

- `isValidEmail(email: string)`: Kiểm tra email hợp lệ
- `isValidVietnamesePhone(phone: string)`: Kiểm tra số điện thoại Việt Nam
- `isValidVietnameseIdCard(idCard: string)`: Kiểm tra CMND/CCCD
- `isNumeric(str: string)`: Kiểm tra chuỗi chỉ chứa số
- `isNotEmpty(value: any)`: Kiểm tra giá trị không rỗng

### 4. Object Utils (`object.utils.ts`)

- `isMethodOverridden(instance, methodName, baseClass)`: Kiểm tra method có được override không
- `getAllPropertyNames(obj)`: Lấy tất cả tên properties của object
- `deepClone(obj)`: Clone sâu object
- `deepEqual(obj1, obj2)`: So sánh sâu hai object

## Ví dụ sử dụng

```typescript
// Trong entity
import { removeAccents } from '../../../common/utils';

@BeforeInsert()
generateNameSlug() {
  this.name_slug = removeAccents(this.name);
}

// Trong service
import { isValidEmail, formatVietnameseDate } from '../../../common/utils';

async createUser(userData: CreateUserDto) {
  if (!isValidEmail(userData.email)) {
    throw new BadRequestException('Email không hợp lệ');
  }

  const user = new User();
  user.createdAt = new Date();
  user.createdAtFormatted = formatVietnameseDate(user.createdAt);
  // ...
}

// Trong base service để kiểm tra override
import { isMethodOverridden } from '../../../common/utils';

const isApplyFilterOverridden = isMethodOverridden(this, 'applyFilter', BaseService);
if (isApplyFilterOverridden) {
  // Chạy logic override
} else {
  // Chạy logic mặc định
}
```

## Thêm utility function mới

1. Tạo file mới trong thư mục `utils/` hoặc thêm vào file phù hợp
2. Export function từ file đó
3. Thêm export vào `index.ts`
4. Cập nhật README này
