import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    required: true,
  })
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Endereço de e-mail único do usuário',
    example: 'joao.silva@example.com',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Senha do usuário (será armazenada com criptografia)',
    example: 'Senha@123',
    required: true,
    minLength: 8,
  })
  senha: string;

  @IsEnum(['admin', 'gerente', 'colaborador', 'cliente'])
  @IsNotEmpty()
  @ApiProperty({
    description: 'Perfil de acesso do usuário no sistema',
    enum: ['admin', 'gerente', 'colaborador', 'cliente'],
    example: 'colaborador',
    required: true,
  })
  perfil: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Telefone de contato do usuário',
    example: '(11) 98765-4321',
  })
  telefone?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Indica se o usuário está ativo no sistema',
    example: true,
    default: true,
  })
  ativo?: boolean;
}
