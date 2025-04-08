import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global para tratamento padronizado de exceções HTTP
 * Garante uma resposta de erro consistente em toda a aplicação
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // Obtém mensagem e detalhes do erro
    let message = 'Erro interno do servidor';
    let errors = null;

    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (errorResponse && typeof errorResponse === 'object') {
      message = errorResponse['message'] || message;
      errors = errorResponse['erros'] || null;
    }

    // Registra o erro no log
    this.logger.error(
      `[${request.method}] ${request.url} - ${status}: ${message}`,
      exception.stack,
    );

    // Resposta padronizada de erro
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errors && { errors }),
    };

    response.status(status).json(responseBody);
  }
}

/**
 * Filtro para tratamento de exceções não-HTTP (erros não tratados)
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Status code padrão para erros não tratados
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Registra o erro não tratado
    this.logger.error(
      `Erro não tratado: [${request.method}] ${request.url}`,
      exception.stack,
    );

    // Resposta padronizada para erro interno
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Erro interno do servidor',
    };

    response.status(status).json(responseBody);
  }
} 