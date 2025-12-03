import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateFatorTecnicoProjetoDto } from './create-fator-tecnico-projeto.dto';

export class UpdateFatorTecnicoProjetoDto extends PartialType(CreateFatorTecnicoProjetoDto) {}
