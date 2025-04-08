import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { SwimlaneDto } from './swimlane.dto';

export class UpdateSwimlaneDto extends PartialType(SwimlaneDto) {}
