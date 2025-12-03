/**
 * Interface para respostas paginadas
 * Padroniza o formato de resposta para dados paginados
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Função utilitária para criar uma resposta paginada
 * @param items Lista de itens na página atual
 * @param total Total de itens
 * @param page Número da página atual
 * @param limit Limite de itens por página
 * @returns Objeto de resposta paginada padronizado
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  return {
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Extrai e valida parâmetros de paginação
 * @param params Parâmetros de paginação recebidos
 * @param defaultPage Página padrão se não for especificada
 * @param defaultLimit Limite padrão se não for especificado
 * @returns Parâmetros de paginação validados
 */
export function extractPaginationParams(
  params: PaginationParams,
  defaultPage: number = 1,
  defaultLimit: number = 10,
): { page: number; limit: number; skip: number } {
  const page = Math.max(1, params.page || defaultPage);
  const limit = Math.max(1, Math.min(params.limit || defaultLimit, 100));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
} 