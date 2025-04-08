import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Decorador que estende ApiProperty para incluir facilmente exemplos
 * 
 * @param example Valor de exemplo para a propriedade
 * @param options Opções adicionais para ApiProperty
 * @returns Decorador ApiProperty com exemplo configurado
 */
export function ApiPropertyWithExample<T>(
  example: T,
  options: Omit<ApiPropertyOptions, 'example'> = {},
): PropertyDecorator {
  return ApiProperty({
    ...options,
    example,
  });
}

/**
 * Decorador para marcar uma propriedade como opcional com exemplo
 * 
 * @param example Valor de exemplo para a propriedade
 * @param options Opções adicionais para ApiProperty
 * @returns Decorador ApiProperty com exemplo configurado como opcional
 */
export function ApiPropertyOptionalWithExample<T>(
  example: T,
  options: Omit<ApiPropertyOptions, 'example' | 'required'> = {},
): PropertyDecorator {
  return ApiProperty({
    ...options,
    example,
    required: false,
  });
} 