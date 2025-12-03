import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Messages } from '../common/constants/messages.constant';

/**
 * Interface para configuração da validação de entidade
 */
interface ValidateEntityOptions {
  /**
   * Tipo de entidade a ser validada
   */
  entityType: any;
  
  /**
   * Nome da entidade para mensagens de erro
   */
  entityName?: string;
  
  /**
   * Campo para busca (padrão: 'id')
   */
  field?: string;
}

/**
 * Decorator para validar a existência de uma entidade
 * Busca a entidade antes de executar o controlador e lança exceção se não existir
 * 
 * @param options Opções de configuração
 * @returns O decorador configurado
 */
export const ValidateEntity = (options: ValidateEntityOptions) => {
  return createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const app = request.app.get('nestjs');
    const repository: Repository<any> = app.get(
      getRepositoryToken(options.entityType),
    );

    const field = options.field || 'id';
    const paramValue = request.params[field] || request.query[field] || request.body[field];
    
    if (!paramValue) {
      throw new BadRequestException(`Parâmetro ${field} não fornecido`);
    }

    const entity = await repository.findOne({ 
      where: { [field]: paramValue } 
    });
    
    if (!entity) {
      throw new BadRequestException(
        Messages.NOT_FOUND(
          options.entityName || options.entityType.name,
          paramValue,
        ),
      );
    }

    return entity;
  });
}; 