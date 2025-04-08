import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

/**
 * Interceptor para transformar erros de entidade não encontrada do TypeORM
 * em exceções HTTP amigáveis 
 */
@Injectable()
export class EntityNotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException({
            message: 'Entidade não encontrada',
            description: error.message,
          });
        }
        throw error;
      }),
    );
  }
} 