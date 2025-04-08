import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface ApiDocsOptions {
  summary: string;
  description?: string;
  responseDescription?: string;
  status?: HttpStatus;
  requiresAuth?: boolean;
}

export function ApiDocs(options: ApiDocsOptions) {
  const {
    summary,
    description = '',
    responseDescription = 'Success',
    status = HttpStatus.OK,
    requiresAuth = true,
  } = options;

  const decorators = [
    ApiOperation({
      summary,
      description,
    }),
    ApiResponse({
      status,
      description: responseDescription,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Requisição inválida',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Não autorizado',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Erro interno do servidor',
    }),
  ];

  if (requiresAuth) {
    decorators.push(
      ApiHeader({
        name: 'Authorization',
        description: 'Token de autenticação',
        required: true,
      }),
    );
  }

  return applyDecorators(...decorators);
}
