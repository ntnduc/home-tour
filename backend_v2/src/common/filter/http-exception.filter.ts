import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseCode, ResponseUtil } from '../reponse/base.response';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let code = ResponseCode.SERVER_ERROR;
    let message = 'Internal server error';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'object') {
        const resObj = response as any;
        message = resObj.message || message;
        errors = resObj.message || resObj.errors || null;

        if (status === HttpStatus.BAD_REQUEST)
          code = ResponseCode.VALIDATION_ERROR;
        else if (status === HttpStatus.UNAUTHORIZED)
          code = ResponseCode.UNAUTHORIZED;
        else if (status === HttpStatus.FORBIDDEN) code = ResponseCode.FORBIDDEN;
        else if (status === HttpStatus.NOT_FOUND) code = ResponseCode.NOT_FOUND;
        else code = ResponseCode.BUSINESS_ERROR;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    res.status(status).json(ResponseUtil.error(code, message, errors));
  }
}
