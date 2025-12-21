import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * HTTP Caching interceptor
 * Caches GET requests for improved performance
 * Follows Single Responsibility Principle
 */
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>();

  // List of endpoints that should not be cached
  private readonly noCacheEndpoints = [
    '/verify',
    '/signin',
    '/signup',
    '/logout',
    '/execucao',
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Only cache GET requests
    if (req.method !== 'GET' || this.shouldSkipCache(req.url)) {
      return next.handle(req);
    }

    // Check if response is already cached
    const cachedResponse = this.cache.get(req.url);
    if (cachedResponse) {
      return of(new HttpResponse({ body: cachedResponse }));
    }

    // If not cached, make the request and cache the response
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.url, event.body);
        }
      }),
    );
  }

  /**
   * Check if a request should bypass the cache
   * @param url Request URL
   * @returns True if cache should be skipped
   */
  private shouldSkipCache(url: string): boolean {
    return this.noCacheEndpoints.some((endpoint) => url.includes(endpoint));
  }

  /**
   * Clear the cache
   * Useful when data changes
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache for a specific endpoint
   * @param url URL to clear from cache
   */
  clearCacheForUrl(url: string): void {
    this.cache.delete(url);
  }
}
