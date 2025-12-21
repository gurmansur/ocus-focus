import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { ILogger } from '../interfaces/logger.interface';

/**
 * Global Exception Filter - Single Responsibility Principle
 * Centralized error handling and logging
 * Converts all exceptions to consistent HTTP responses
 */
@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: ILogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message = (errorResponse as any).message || exception.message;
      details = (errorResponse as any).error;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(message, exception);
    }

    this.logger.warn(`Error: ${status} - ${message}`);

    response.status(status).json({
      statusCode: status,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    });
  }
}
