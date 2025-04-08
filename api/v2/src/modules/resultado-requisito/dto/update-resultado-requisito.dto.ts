import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateResultadoRequisitoDto } from './create-resultado-requisito.dto';

export class UpdateResultadoRequisitoDto extends PartialType(CreateResultadoRequisitoDto) {}
