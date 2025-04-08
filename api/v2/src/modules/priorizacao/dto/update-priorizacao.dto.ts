import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePriorizacaoDto } from './create-priorizacao.dto';

export class UpdatePriorizacaoDto extends PartialType(CreatePriorizacaoDto) {}
