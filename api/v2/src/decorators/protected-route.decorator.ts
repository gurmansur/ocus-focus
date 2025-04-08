import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ROLES_KEY } from './roles.decorator';

/**
 * Decorator composto para aplicar proteção de rota com funções específicas
 * Combina múltiplos decorators em um para facilitar o uso
 *
 * @param roles Lista de funções que podem acessar a rota
 * @returns Os decorators combinados
 */
export function ProtectedRoute(...roles: string[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Não autorizado' }),
  );
}
