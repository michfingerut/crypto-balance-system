import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { CBSLogging } from '../logging/logging.service';

interface ErrorResponse {
  message?: string | string[];
  [key: string]: any;
}

@Catch(HttpException)
export class CBSError implements ExceptionFilter {
  constructor(private readonly logger: CBSLogging) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception.getResponse() as ErrorResponse;
    const message = Array.isArray(errorResponse.message)
      ? errorResponse.message.join(', ')
      : errorResponse.message || 'Internal server error';

    this.logger.error(` ${status} : ${message}`);

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
