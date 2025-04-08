import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO para autenticação de stakeholder
 */
export class SignInStakeholderDto {
  @ApiProperty({
    description: 'Chave única do stakeholder fornecida pela equipe do projeto',
    example: '5e9f8f8f8f8f8f8f8f8f8f8f',
    required: true,
  })
  @IsString({ message: 'Chave deve ser uma string' })
  @IsNotEmpty({ message: 'Chave é obrigatória' })
  chave: string;

  @ApiProperty({
    description: 'Senha de acesso do stakeholder',
    example: 'Senha@123',
    required: true,
    minLength: 8,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  senha: string;
}
