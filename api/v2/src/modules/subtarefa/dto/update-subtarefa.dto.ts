import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSubtarefaDto } from './create-subtarefa.dto';

export class UpdateSubtarefaDto extends PartialType(CreateSubtarefaDto) {}
