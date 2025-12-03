// Cấu trúc response chuẩn cho API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Cấu trúc response cho trường hợp lỗi
export interface ApiError {
  success: false;
  message: string;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Cấu trúc response cho trường hợp thành công
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  code?: number;
}

// Các mã lỗi thường gặp
export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  NETWORK_ERROR = "NETWORK_ERROR",
}
