import { ApiError, ApiSuccess, ErrorCode } from "@/types/api";
import axios, { AxiosError } from "axios";

// Hàm tạo response thành công
export const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiSuccess<T> => ({
  success: true,
  data,
  message,
});

// Hàm tạo response lỗi
export const createErrorResponse = (
  message: string,
  code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
  details?: any
): ApiError => ({
  success: false,
  message,
  error: {
    code,
    message,
    details,
  },
});

// Hàm xử lý lỗi từ axios
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Xử lý lỗi mạng
    if (!axiosError.response) {
      return createErrorResponse(
        "Không thể kết nối đến máy chủ",
        ErrorCode.NETWORK_ERROR
      );
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data as any;

    // Xử lý các mã lỗi HTTP phổ biến
    switch (status) {
      case 400:
        return createErrorResponse(
          data?.message || "Yêu cầu không hợp lệ",
          ErrorCode.BAD_REQUEST,
          data?.details
        );
      case 401:
        return createErrorResponse(
          "Phiên đăng nhập đã hết hạn",
          ErrorCode.UNAUTHORIZED
        );
      case 403:
        return createErrorResponse(
          "Bạn không có quyền thực hiện thao tác này",
          ErrorCode.FORBIDDEN
        );
      case 404:
        return createErrorResponse(
          "Không tìm thấy dữ liệu",
          ErrorCode.NOT_FOUND
        );
      case 422:
        return createErrorResponse(
          data?.message || "Dữ liệu không hợp lệ",
          ErrorCode.VALIDATION_ERROR,
          data?.details
        );
      default:
        return createErrorResponse(
          "Đã có lỗi xảy ra",
          ErrorCode.INTERNAL_SERVER_ERROR
        );
    }
  }

  // Xử lý các lỗi khác
  return createErrorResponse(
    "Đã có lỗi xảy ra",
    ErrorCode.INTERNAL_SERVER_ERROR
  );
};
