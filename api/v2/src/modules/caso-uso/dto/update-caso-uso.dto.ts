import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCasoUsoDto } from './create-caso-uso.dto';

export class UpdateCasoUsoDto extends PartialType(CreateCasoUsoDto) {}
