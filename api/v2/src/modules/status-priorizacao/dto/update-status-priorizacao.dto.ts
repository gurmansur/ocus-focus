import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusPriorizacaoDto } from './create-status-priorizacao.dto';

export class UpdateStatusPriorizacaoDto extends PartialType(CreateStatusPriorizacaoDto) {}
