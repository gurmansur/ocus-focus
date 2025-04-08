import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSuiteDeTesteDto } from './create-suite-de-teste.dto';

export class UpdateSuiteDeTesteDto extends PartialType(CreateSuiteDeTesteDto) {}
