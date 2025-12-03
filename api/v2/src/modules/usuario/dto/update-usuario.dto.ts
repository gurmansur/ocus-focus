import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';

/**
 * DTO para atualização de usuário
 * 
 * Estende o CreateUsuarioDto, tornando todos os campos opcionais
 * para permitir a atualização parcial do usuário
 */
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  /**
   * Documentação adicional apenas para demonstrar como sobrescrever
   * um campo herdado se necessário
   */
  @ApiProperty({
    description: 'Indica se o usuário está ativo no sistema',
    example: true,
    required: false
  })
  ativo?: boolean;
}
