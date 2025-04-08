import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interceptor para tratamento padronizado de exceções
 * Garante que todas as exceções retornem um formato consistente
 */
@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Obtém o contexto da requisição
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const url = request.url;
        const method = request.method;

        // Configura status e mensagem padrão
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Ocorreu um erro interno no servidor';
        let code = 'INTERNAL_SERVER_ERROR';

        // Se for uma exceção HTTP do NestJS, usa suas propriedades
        if (error instanceof HttpException) {
          status = error.getStatus();
          const response = error.getResponse();

          if (typeof response === 'object') {
            message = response['message'] || message;
            code = response['code'] || this.getCodeFromStatus(status);
          } else {
            message = response || message;
            code = this.getCodeFromStatus(status);
          }
        }

        // Loga o erro
        this.logger.error(
          `[${method}] ${url} - Status: ${status} - ${message}`,
          error.stack,
        );

        // Retorna uma resposta formatada
        return throwError(
          () =>
            new HttpException(
              {
                status: 'error',
                message,
                code,
                timestamp: new Date().toISOString(),
                path: url,
              },
              status,
            ),
        );
      }),
    );
  }

  /**
   * Obtém um código de erro com base no status HTTP
   * @param status Status HTTP
   * @returns Código de erro correspondente
   */
  private getCodeFromStatus(status: number): string {
    const statusCodes = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
    };

    return statusCodes[status] || 'UNKNOWN_ERROR';
  }
}
