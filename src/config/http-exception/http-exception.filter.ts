/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    let message = 'An error occurred';
    let details = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = exceptionResponse['message'] || message;
      details = exceptionResponse['details'] || null;
    }

    response.status(status).json({
      statusCode: status,
      errors: {
        message,
        type: exceptionResponse['error'],
        details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
