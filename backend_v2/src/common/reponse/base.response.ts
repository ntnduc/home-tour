export enum ResponseCode {
  SUCCESS = 0,
  VALIDATION_ERROR = 1001,
  BUSINESS_ERROR = 1002,
  UNAUTHORIZED = 1003,
  FORBIDDEN = 1004,
  NOT_FOUND = 1005,
  SERVER_ERROR = 1500,
}

export interface BaseResponse<T = any> {
  code: ResponseCode;
  message: string;
  data?: T;
  errors?: any;
  success: boolean;
}

export class ResponseUtil {
  static success<T = any>(data: T, message = 'Success'): BaseResponse<T> {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data,
      success: true,
    };
  }

  static error(
    code: ResponseCode,
    message: string,
    errors?: any,
  ): BaseResponse {
    return {
      code,
      message,
      errors,
      success: false,
    };
  }
}
