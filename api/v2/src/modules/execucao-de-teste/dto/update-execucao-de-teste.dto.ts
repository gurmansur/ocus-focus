import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExecucaoDeTesteDto } from './create-execucao-de-teste.dto';

export class UpdateExecucaoDeTesteDto extends PartialType(
  CreateExecucaoDeTesteDto,
) {}
