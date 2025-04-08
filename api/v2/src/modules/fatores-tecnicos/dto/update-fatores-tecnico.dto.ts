import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateFatoresTecnicoDto } from './create-fatores-tecnico.dto';

export class UpdateFatoresTecnicoDto extends PartialType(CreateFatoresTecnicoDto) {}
