/**
 * Constantes para mensagens padrão do sistema
 * Centraliza strings para facilitar manutenção e internacionalização
 */
export const Messages = {
  // Mensagens de erro
  NOT_FOUND: (entity: string, id: string | number) => 
    `${entity} com ID ${id} não encontrado(a)`,
  UNAUTHORIZED: 'Acesso não autorizado',
  FORBIDDEN: 'Acesso negado para este recurso',
  VALIDATION_ERROR: 'Erro de validação de dados',
  INTERNAL_ERROR: 'Erro interno do servidor',
  ENTITY_ALREADY_EXISTS: (entity: string, field: string, value: string) => 
    `${entity} com ${field} '${value}' já existe`,
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  
  // Mensagens de sucesso
  CREATED: (entity: string) => 
    `${entity} criado(a) com sucesso`,
  UPDATED: (entity: string) => 
    `${entity} atualizado(a) com sucesso`,
  DELETED: (entity: string) => 
    `${entity} removido(a) com sucesso`,
  OPERATION_SUCCESS: 'Operação realizada com sucesso',
  
  // Entidades do sistema
  ENTITIES: {
    USER: 'Usuário',
    COLABORADOR: 'Colaborador',
    PROJETO: 'Projeto',
    REQUISITO: 'Requisito',
    STAKEHOLDER: 'Stakeholder',
    SPRINT: 'Sprint',
    TASK: 'Tarefa',
  },
}; 