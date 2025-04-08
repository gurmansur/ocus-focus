import { Logger } from '@nestjs/common';
import { SanitizePipe } from '../pipes/sanitize.pipe';

/**
 * Classe base para controllers
 * Implementa boas práticas e padrões comuns para os controllers
 */
export abstract class BaseController {
  protected readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  /**
   * Sanitiza dados de entrada para garantir segurança
   * @param data Dados a serem sanitizados
   * @returns Dados sanitizados
   */
  protected sanitizeInput<T>(data: T): T {
    const sanitize = new SanitizePipe();
    return sanitize.transform(data, { type: 'body', metatype: null, data: '' });
  }

  /**
   * Formata resposta de erro para garantir consistência
   * @param message Mensagem de erro
   * @param code Código do erro
   * @returns Objeto formatado com o erro
   */
  protected formatErrorResponse(message: string, code: string): any {
    this.logger.error(`Erro: ${code} - ${message}`);
    return {
      status: 'error',
      message,
      code,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Registra uma operação no log
   * @param operation Nome da operação
   * @param details Detalhes da operação
   */
  protected logOperation(operation: string, details?: any): void {
    this.logger.log(`Operação: ${operation}${details ? ` - ${JSON.stringify(details)}` : ''}`);
  }
} 