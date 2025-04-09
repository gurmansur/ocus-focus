import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = `cache_${request.url}`;

    // Try to get the response from cache
    const cachedResponse = await this.cacheManager.get(cacheKey);
    
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Cache the response with a TTL (time to live)
    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheManager.set(cacheKey, response, 60 * 1000); // 1 minute
      }),
    );
  }
} 