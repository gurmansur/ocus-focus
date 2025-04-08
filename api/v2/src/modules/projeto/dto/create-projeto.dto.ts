import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEnum, IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para criação de novo projeto
 */
export class CreateProjetoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    description: 'Nome do projeto', 
    example: 'Sistema de Gestão de Requisitos',
    required: true
  })
  nome: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    description: 'Descrição detalhada do projeto', 
    example: 'Desenvolvimento de um sistema para gerenciamento de requisitos de software, incluindo controle de versões e rastreabilidade.',
    required: true
  })
  descricao: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    description: 'Nome da empresa cliente do projeto', 
    example: 'TechSolutions Ltda.',
    required: true
  })
  empresa: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ 
    description: 'Data de início do projeto (formato ISO 8601)', 
    example: '2023-04-01T00:00:00.000Z',
    required: true,
    type: Date
  })
  dataInicio: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ 
    description: 'Data prevista para a conclusão do projeto (formato ISO 8601)', 
    example: '2023-10-31T23:59:59.000Z',
    required: true,
    type: Date
  })
  previsaoFim: Date;

  @IsEnum(['EM ANDAMENTO', 'FINALIZADO', 'CANCELADO'])
  @IsNotEmpty()
  @ApiProperty({ 
    description: 'Status atual do projeto', 
    example: 'EM ANDAMENTO',
    enum: ['EM ANDAMENTO', 'FINALIZADO', 'CANCELADO'],
    required: true
  })
  status: 'EM ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
}
