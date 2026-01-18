import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  ActorWeightDto,
  EnvironmentalFactorDto,
  SessionStatus,
  TechnicalFactorDto,
  UseCaseWeightDto,
} from './estimativa-session.dto';

export class UpdateEstimativaSessionDto {
  @ApiProperty({ example: 'E-commerce Platform Estimation', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Updated description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [UseCaseWeightDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UseCaseWeightDto)
  useCaseWeights?: UseCaseWeightDto[];

  @ApiProperty({ type: [ActorWeightDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActorWeightDto)
  actorWeights?: ActorWeightDto[];

  @ApiProperty({ type: [TechnicalFactorDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechnicalFactorDto)
  technicalFactors?: TechnicalFactorDto[];

  @ApiProperty({ type: [EnvironmentalFactorDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvironmentalFactorDto)
  environmentalFactors?: EnvironmentalFactorDto[];

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsNumber()
  hoursPerUCP?: number;

  @ApiProperty({ enum: SessionStatus, required: false })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;
}
