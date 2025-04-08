import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateFatorAmbientalProjetoDto } from './create-fator-ambiental-projeto.dto';

export class UpdateFatorAmbientalProjetoDto extends PartialType(CreateFatorAmbientalProjetoDto) {}
