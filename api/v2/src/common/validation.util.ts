import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

/**
 * Utilitário para validação de dados e tratamento de erros
 */
export class ValidationUtil {
  /**
   * Verifica se um valor existe e lança uma exceção caso não exista
   * @param value Valor a ser verificado
   * @param entityName Nome da entidade
   * @param id Identificador da entidade
   * @throws NotFoundException se o valor não existir
   */
  static checkExists<T>(value: T | null | undefined, entityName: string, id?: number | string): T {
    if (value === null || value === undefined) {
      throw new NotFoundException({
        message: `${entityName} ${id ? `com id ${id}` : ''} não encontrado(a)`,
        code: 'ENTITY_NOT_FOUND',
      });
    }
    return value;
  }

  /**
   * Valida se um valor é verdadeiro, lançando exceção caso seja falso
   * @param condition Condição a ser validada
   * @param message Mensagem de erro
   * @param code Código de erro
   * @throws BadRequestException se a condição for falsa
   */
  static validate(condition: boolean, message: string, code = 'VALIDATION_FAILED'): void {
    if (!condition) {
      throw new BadRequestException({
        message,
        code,
      });
    }
  }

  /**
   * Trata erros do banco de dados e lança exceções apropriadas
   * @param error Erro capturado
   * @param entityName Nome da entidade
   * @throws BadRequestException ou InternalServerErrorException
   */
  static handleDbError(error: any, entityName: string): never {
    const message = error.message || 'Erro desconhecido';
    
    // Verifica se é um erro de chave duplicada
    if (message.includes('duplicate') || message.includes('unique constraint')) {
      throw new BadRequestException({
        message: `Já existe um(a) ${entityName.toLowerCase()} com esses dados`,
        code: 'DUPLICATE_ENTRY',
      });
    }
    
    // Verifica se é um erro de chave estrangeira
    if (message.includes('foreign key') || message.includes('constraint fails')) {
      throw new BadRequestException({
        message: `Não foi possível realizar a operação devido a restrições de relacionamento`,
        code: 'FOREIGN_KEY_CONSTRAINT',
      });
    }

    // Para outros erros, lança um erro interno
    throw new InternalServerErrorException({
      message: `Erro ao processar operação com ${entityName.toLowerCase()}`,
      code: 'DATABASE_ERROR',
    });
  }
}