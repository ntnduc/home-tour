import { registerAs } from '@nestjs/config';

export class UploadFileConfig {
  // Đường dẫn lưu trữ
  uploadPath: string; // './uploads' hoặc '/var/uploads'
  publicUrlPrefix: string; // 'http://localhost:3000/uploads' hoặc CDN URL

  // Giới hạn kích thước
  maxFileSize: number; // bytes (default: 10MB = 10 * 1024 * 1024)
  maxFilesPerRequest: number; // Số file tối đa mỗi request (default: 10)

  // Loại file cho phép
  allowedMimeTypes: string[]; // ['image/jpeg', 'image/png', 'application/pdf', ...]
  allowedExtensions: string[]; // ['.jpg', '.jpeg', '.png', '.pdf', ...]

  // Cấu hình theo category
  categoryConfig: {
    [category: string]: {
      maxSize?: number;
      allowedTypes?: string[];
      allowedExtensions?: string[];
    };
  };

  // Naming strategy
  namingStrategy: 'uuid'; // Cách đặt tên file (hiện tại chỉ dùng UUID)

  // Security
  enableImageValidation: boolean; // Validate image file thật sự là image
}

export default registerAs('uploadFile', (): UploadFileConfig => {
  const defaultMaxSize = 10 * 1024 * 1024; // 10MB

  return {
    uploadPath: process.env.STORAGE_UPLOAD_PATH || './uploads',
    publicUrlPrefix:
      process.env.STORAGE_PUBLIC_URL || 'http://localhost:3000/uploads',
    maxFileSize: parseInt(process.env.STORAGE_MAX_FILE_SIZE || '10485760', 10), // 10MB default
    maxFilesPerRequest: parseInt(
      process.env.STORAGE_MAX_FILES_PER_REQUEST || '10',
      10,
    ),
    allowedMimeTypes: process.env.STORAGE_ALLOWED_MIME_TYPES
      ? process.env.STORAGE_ALLOWED_MIME_TYPES.split(',')
      : [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/heic',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
    allowedExtensions: process.env.STORAGE_ALLOWED_EXTENSIONS
      ? process.env.STORAGE_ALLOWED_EXTENSIONS.split(',')
      : [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.pdf',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
        '.heic',
      ],
    categoryConfig: {
      avatar: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
      },
      contract: {
        maxSize: 20 * 1024 * 1024, // 20MB
        allowedTypes: [
          'application/pdf',
          'image/jpeg',
          'image/jpg',
          'image/png',
        ],
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
      },
      invoice: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: [
          'application/pdf',
          'image/jpeg',
          'image/jpg',
          'image/png',
        ],
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
      },
    },
    namingStrategy: 'uuid',
    enableImageValidation: process.env.STORAGE_ENABLE_IMAGE_VALIDATION === 'true',
  };
});
