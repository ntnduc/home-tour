# UploadFile Component

Component upload file/hình ảnh với design đẹp, dễ sử dụng và phù hợp với các component khác trong project.

## Cài đặt

Component này yêu cầu các package sau:

```bash
yarn add expo-image-picker expo-document-picker
# hoặc
npm install expo-image-picker expo-document-picker
```

## Sử dụng

### Cơ bản

```tsx
import UploadFile from '@/components/Uploadfile';

<UploadFile
  label="Chọn hình ảnh"
  type="image"
  value={image}
  onChange={setImage}
/>
```

### Upload file

```tsx
<UploadFile
  label="Chọn file"
  type="file"
  value={file}
  onChange={setFile}
  acceptedTypes={['application/pdf', 'application/msword']}
  maxSize={5} // 5MB
/>
```

### Upload nhiều file

```tsx
<UploadFile
  label="Chọn nhiều hình ảnh"
  type="image"
  multiple
  maxFiles={5}
  value={images}
  onChange={setImages}
/>
```

### Upload cả hình ảnh và file

```tsx
<UploadFile
  label="Chọn hình ảnh hoặc file"
  type="both"
  value={file}
  onChange={setFile}
/>
```

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `label` | `string` | - | Nhãn hiển thị phía trên component |
| `value` | `UploadedFile \| UploadedFile[] \| null` | - | File(s) đã chọn |
| `onChange` | `(files: UploadedFile \| UploadedFile[] \| null) => void` | - | Callback khi file thay đổi |
| `type` | `'image' \| 'file' \| 'both'` | `'both'` | Loại file có thể chọn |
| `error` | `string` | - | Thông báo lỗi |
| `required` | `boolean` | `false` | Bắt buộc phải chọn file |
| `disabled` | `boolean` | `false` | Vô hiệu hóa component |
| `multiple` | `boolean` | `false` | Cho phép chọn nhiều file |
| `maxFiles` | `number` | `5` | Số file tối đa (khi multiple = true) |
| `maxSize` | `number` | `10` | Kích thước file tối đa (MB) |
| `acceptedTypes` | `string[]` | - | Các MIME types được chấp nhận |
| `placeholder` | `string` | - | Placeholder text |
| `containerStyles` | `StyleProp<ViewStyle>` | - | Custom styles cho container |
| `onUploadStart` | `() => void` | - | Callback khi bắt đầu upload |
| `onUploadEnd` | `() => void` | - | Callback khi kết thúc upload |
| `onError` | `(error: string) => void` | - | Callback khi có lỗi |
| `icon` | `keyof typeof Ionicons.glyphMap` | `'cloud-upload-outline'` | Icon hiển thị |
| `iconProps` | `UploadFileIconProps` | - | Props cho icon |
| `showPreview` | `boolean` | `true` | Hiển thị preview cho hình ảnh |

## UploadedFile Interface

```typescript
interface UploadedFile {
  uri: string;        // URI của file
  name: string;       // Tên file
  type?: string;      // Loại file ('image' | 'file')
  size?: number;      // Kích thước file (bytes)
  mimeType?: string;  // MIME type
}
```

## Ví dụ đầy đủ

```tsx
import React, { useState } from 'react';
import UploadFile, { UploadedFile } from '@/components/Uploadfile';

const MyScreen = () => {
  const [image, setImage] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string>('');

  return (
    <UploadFile
      label="Hình ảnh sản phẩm"
      type="image"
      value={image}
      onChange={(file) => {
        setImage(file);
        setError('');
      }}
      error={error}
      required
      maxSize={5}
      acceptedTypes={['image/jpeg', 'image/png']}
      onError={(err) => setError(err)}
    />
  );
};
```

## Lưu ý

- Component tự động xử lý quyền truy cập thư viện ảnh
- Validation tự động cho kích thước và loại file
- Preview tự động cho hình ảnh
- Hỗ trợ xóa file đã chọn
- Design phù hợp với các component khác trong project
