import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCenarioDto } from './create-cenario.dto';

export class UpdateCenarioDto extends PartialType(CreateCenarioDto) {}
