import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { CacheInterceptor } from '../interceptors/cache.interceptor';

export function UseCache(): MethodDecorator {
  return applyDecorators(UseInterceptors(CacheInterceptor));
}
