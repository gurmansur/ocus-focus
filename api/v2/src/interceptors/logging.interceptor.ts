import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const startTime = Date.now();
    
    // Log the request details
    this.logger.log({
      message: `${method} ${url}`,
      ip,
      userAgent,
      body: Object.keys(body || {}).length ? this.sanitizeBody(body) : undefined,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          
          // Log the response details
          this.logger.log({
            message: `${method} ${url} completed`,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
          });
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          
          // Log detailed error information
          this.logger.error({
            message: `${method} ${url} failed`,
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
          });
        },
      }),
    );
  }
  
  /**
   * Sanitizes the request body to remove sensitive information
   */
  private sanitizeBody(body: any): any {
    if (!body) return {};
    
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'senha', 'token', 'secret', 'authorization'];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '********';
      }
    }
    
    return sanitized;
  }
}
