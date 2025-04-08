import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCasoDeTesteDto } from './create-caso-de-teste.dto';

export class UpdateCasoDeTesteDto extends PartialType(CreateCasoDeTesteDto) {}
