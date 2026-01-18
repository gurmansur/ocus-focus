import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlanoDto {
  @ApiProperty({ example: 'Pro', description: 'Nome do plano' })
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'Plano ideal para profissionais',
    description: 'Descrição do plano',
  })
  @IsString()
  descricao: string;

  @ApiProperty({ example: 29.0, description: 'Preço mensal' })
  @IsNumber()
  precoMensal: number;

  @ApiProperty({ example: 23.0, description: 'Preço anual (por mês)' })
  @IsNumber()
  precoAnual: number;

  @ApiProperty({
    example: null,
    description: 'Limite de projetos (null = ilimitado)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limiteProjetos?: number | null;

  @ApiProperty({
    example: 5,
    description: 'Limite de usuários (null = ilimitado)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limiteUsuarios?: number | null;

  @ApiProperty({
    example: ['arcatest', 'prioreasy', 'estima', 'flying-cards'],
    description: 'Ferramentas disponíveis',
  })
  @IsArray()
  @IsString({ each: true })
  ferramentasDisponiveis: string[];

  @ApiProperty({
    example: {
      apiAccess: true,
      exportReports: true,
      prioritySupport: true,
    },
    description: 'Características adicionais do plano',
  })
  @IsObject()
  caracteristicas: Record<string, any>;

  @ApiProperty({
    example: true,
    description: 'Indica se o plano está ativo',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
