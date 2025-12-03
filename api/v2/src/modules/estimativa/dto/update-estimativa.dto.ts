import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateEstimativaDto } from './create-estimativa.dto';

export class UpdateEstimativaDto extends PartialType(CreateEstimativaDto) {}
