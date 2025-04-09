import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log the request at the beginning
    this.logger.log({
      message: `Request: ${method} ${originalUrl}`,
      ip,
      userAgent,
      requestId: req.headers['x-request-id'] || `req-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });

    // Add response listener to log after the request completes
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const responseTime = Date.now() - startTime;

      // Log the response details after completion
      const logMessage = {
        message: `Response: ${method} ${originalUrl}`,
        statusCode,
        contentLength,
        responseTime: `${responseTime}ms`,
        ip,
        userAgent,
        requestId: req.headers['x-request-id'] || `req-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
