import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateStakeholderDto } from './create-stakeholder.dto';

export class UpdateStakeholderDto extends PartialType(CreateStakeholderDto) {}
