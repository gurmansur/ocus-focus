import { 
  CallHandler, 
  ExecutionContext, 
  Injectable, 
  NestInterceptor 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NO_CACHE_KEY } from '../decorators/no-cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, { data: any; expiry: number }>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes in ms

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    // Skip if not a GET request
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Check if the handler is marked with @NoCache()
    const handler = context.getHandler();
    const controller = context.getClass();
    const isNoCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_KEY, [
      handler,
      controller,
    ]);

    // Skip caching if @NoCache is applied
    if (isNoCache) {
      return next.handle();
    }

    const cacheKey = this.getCacheKey(request);
    const cachedItem = this.cache.get(cacheKey);

    // If we have a valid cached item, return it immediately
    if (cachedItem && cachedItem.expiry > Date.now()) {
      return of(cachedItem.data);
    }

    // Otherwise, execute the handler and store the result in cache
    return next.handle().pipe(
      tap((data) => {
        // Only cache successful responses
        if (response.statusCode >= 200 && response.statusCode < 400) {
          this.cache.set(cacheKey, {
            data,
            expiry: Date.now() + this.defaultTTL,
          });
        }
      }),
    );
  }

  private getCacheKey(request: Request): string {
    return `${request.method}:${request.originalUrl}`;
  }
} 