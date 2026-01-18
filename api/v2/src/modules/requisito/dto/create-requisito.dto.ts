import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateRequisitoDto {
  @IsString()
  nome: string;

  @IsString()
  especificacao: string;

  @IsNumber()
  @IsOptional()
  numeroIdentificador?: number;

  // New fields for Prioreasy integration
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(['draft', 'active', 'completed', 'archived'])
  @IsOptional()
  status?: 'draft' | 'active' | 'completed' | 'archived';

  @IsOptional()
  tags?: string[];
}

