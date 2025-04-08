import { SetMetadata } from '@nestjs/common';

/**
 * Decorator that marks a controller method to bypass the cache middleware.
 * Use this on endpoints that should always return fresh data.
 * 
 * Example usage:
 * @Get()
 * @NoCache()
 * findAll() {
 *   return this.service.findAll();
 * }
 */
export const NO_CACHE_KEY = 'no-cache';
export const NoCache = () => SetMetadata(NO_CACHE_KEY, true); 