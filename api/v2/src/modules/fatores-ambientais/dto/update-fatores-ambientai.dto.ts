import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateFatoresAmbientaiDto } from './create-fatores-ambientai.dto';

export class UpdateFatoresAmbientaiDto extends PartialType(CreateFatoresAmbientaiDto) {}
