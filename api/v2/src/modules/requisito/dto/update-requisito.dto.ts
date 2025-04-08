import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRequisitoDto } from './create-requisito.dto';

export class UpdateRequisitoDto extends PartialType(CreateRequisitoDto) {}
