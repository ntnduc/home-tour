import { Response } from "express";

export class ResponseHandler {
  static success(
    res: Response,
    data: any = null,
    message: string = "Thành công"
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string = "Có lỗi xảy ra",
    statusCode: number = 400
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
    });
  }

  static unauthorized(
    res: Response,
    message: string = "Không có quyền truy cập"
  ) {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = "Truy cập bị cấm") {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = "Không tìm thấy dữ liệu") {
    return this.error(res, message, 404);
  }

  static serverError(res: Response, message: string = "Lỗi máy chủ") {
    return this.error(res, message, 500);
  }

  static validationError(
    res: Response,
    message: string = "Dữ liệu không hợp lệ"
  ) {
    return this.error(res, message, 422);
  }

  static tooManyRequests(
    res: Response,
    message: string = "Quá nhiều yêu cầu",
    waitTime?: number
  ) {
    return res.status(429).json({
      success: false,
      message,
      data: waitTime ? { waitTime } : null,
    });
  }
}
