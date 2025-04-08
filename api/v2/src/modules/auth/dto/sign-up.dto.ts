import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

/**
 * DTO para registro de novo usuário
 */
export class SignUpDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    required: true,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({
    description: 'Endereço de email válido e único no sistema',
    example: 'joao.silva@empresa.com',
    required: true,
  })
  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Nome da empresa onde o usuário trabalha',
    example: 'TechSolutions Ltda.',
    required: true,
  })
  @IsString({ message: 'Empresa deve ser uma string' })
  @IsNotEmpty({ message: 'Empresa é obrigatória' })
  empresa: string;

  @ApiProperty({
    description: 'Cargo ou função do usuário na empresa',
    example: 'Desenvolvedor Sênior',
    required: true,
  })
  @IsString({ message: 'Cargo deve ser uma string' })
  @IsNotEmpty({ message: 'Cargo é obrigatório' })
  cargo: string;

  @ApiProperty({
    description:
      'Senha de acesso (mínimo 8 caracteres, contendo letras e números)',
    example: 'Senha@123',
    required: true,
    minLength: 8,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).*$/, {
    message: 'Senha deve conter pelo menos uma letra e um número',
  })
  senha: string;

  @ApiProperty({
    description: 'Confirmação da senha (deve ser idêntica ao campo senha)',
    example: 'Senha@123',
    required: true,
  })
  @IsString({ message: 'Confirmação de senha deve ser uma string' })
  confirmarSenha: string;
}
