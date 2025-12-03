import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateColaboradorDto } from './create-colaborador.dto';

export class UpdateColaboradorDto extends PartialType(CreateColaboradorDto) {
  @ApiPropertyOptional({
    description: 'Nome do colaborador (opcional)',
    example: 'João da Silva',
  })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Email do colaborador (opcional)',
    example: 'joao.silva@empresa.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Senha do colaborador (opcional)',
    example: 'Senha@123',
  })
  @IsString()
  @IsOptional()
  senha?: string;

  @ApiPropertyOptional({
    description: 'Empresa do colaborador (opcional)',
    example: 'Empresa ABC',
  })
  @IsString()
  @IsOptional()
  empresa?: string;

  @ApiPropertyOptional({
    description: 'Cargo do colaborador (opcional)',
    example: 'Analista de Sistemas',
    enum: [
      'Gerente de Projeto',
      'Analista de Sistemas',
      'Desenvolvedor',
      'Product Owner',
      'Scrum Master',
    ],
  })
  @IsEnum([
    'Gerente de Projeto',
    'Analista de Sistemas',
    'Desenvolvedor',
    'Product Owner',
    'Scrum Master',
  ])
  @IsOptional()
  cargo?:
    | 'Gerente de Projeto'
    | 'Analista de Sistemas'
    | 'Desenvolvedor'
    | 'Product Owner'
    | 'Scrum Master';
}
