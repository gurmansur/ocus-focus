import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum SessionStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export enum UseCaseComplexity {
  SIMPLE = 'simple',
  AVERAGE = 'average',
  COMPLEX = 'complex',
}

export enum ActorComplexity {
  SIMPLE = 'simple',
  AVERAGE = 'average',
  COMPLEX = 'complex',
}

export class UseCaseWeightDto {
  @ApiProperty({ example: 'uc-123' })
  @IsString()
  useCaseId: string;

  @ApiProperty({ example: 'User Registration' })
  @IsString()
  useCaseName: string;

  @ApiProperty({ example: 'UC-001' })
  @IsString()
  useCaseCode: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  transactions: number;

  @ApiProperty({ enum: UseCaseComplexity, example: UseCaseComplexity.AVERAGE })
  @IsEnum(UseCaseComplexity)
  complexity: UseCaseComplexity;

  @ApiProperty({ example: 10 })
  @IsNumber()
  weight: number;
}

export class ActorWeightDto {
  @ApiProperty({ example: 'actor-123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Customer' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'End user using web interface' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ActorComplexity, example: ActorComplexity.COMPLEX })
  @IsEnum(ActorComplexity)
  type: ActorComplexity;

  @ApiProperty({ example: 3 })
  @IsNumber()
  weight: number;
}

export class TechnicalFactorDto {
  @ApiProperty({ example: 'T1' })
  @IsString()
  id: string;

  @ApiProperty({ example: 3, minimum: 0, maximum: 5 })
  @IsNumber()
  rating: number;
}

export class EnvironmentalFactorDto {
  @ApiProperty({ example: 'E1' })
  @IsString()
  id: string;

  @ApiProperty({ example: 4, minimum: 0, maximum: 5 })
  @IsNumber()
  rating: number;
}

export class EstimativaSessionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'E-commerce Platform Estimation' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Use Case Points estimation for the new e-commerce platform',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  projectId: number;

  @ApiProperty({ type: [UseCaseWeightDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UseCaseWeightDto)
  useCaseWeights: UseCaseWeightDto[];

  @ApiProperty({ type: [ActorWeightDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActorWeightDto)
  actorWeights: ActorWeightDto[];

  @ApiProperty({ type: [TechnicalFactorDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechnicalFactorDto)
  technicalFactors: TechnicalFactorDto[];

  @ApiProperty({ type: [EnvironmentalFactorDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvironmentalFactorDto)
  environmentalFactors: EnvironmentalFactorDto[];

  @ApiProperty({ example: 30 })
  @IsNumber()
  uucw: number;

  @ApiProperty({ example: 8 })
  @IsNumber()
  uaw: number;

  @ApiProperty({ example: 38 })
  @IsNumber()
  uucp: number;

  @ApiProperty({ example: 12.5 })
  @IsNumber()
  tfactor: number;

  @ApiProperty({ example: 1.025 })
  @IsNumber()
  tcf: number;

  @ApiProperty({ example: 18.5 })
  @IsNumber()
  efactor: number;

  @ApiProperty({ example: 1.235 })
  @IsNumber()
  ef: number;

  @ApiProperty({ example: 48.5 })
  @IsNumber()
  ucp: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  hoursPerUCP: number;

  @ApiProperty({ example: 970 })
  @IsNumber()
  estimatedHours: number;

  @ApiProperty({ example: 121.25 })
  @IsNumber()
  estimatedDays: number;

  @ApiProperty({ enum: SessionStatus, example: SessionStatus.IN_PROGRESS })
  @IsEnum(SessionStatus)
  status: SessionStatus;

  @ApiProperty({ example: '2025-01-06T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-06T15:30:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: 1 })
  @IsNumber()
  createdBy: number;
}
