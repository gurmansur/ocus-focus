import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

class EvidenceDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['image', 'file'] })
  @IsString()
  type: 'image' | 'file';

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  uploadedAt?: string;
}

class StepResultDto {
  @ApiProperty()
  @IsString()
  stepId: string;

  @ApiProperty({ enum: ['passed', 'failed', 'blocked', 'skipped'] })
  @IsString()
  status: 'passed' | 'failed' | 'blocked' | 'skipped';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  actualResult?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [EvidenceDto], required: false })
  @IsOptional()
  @IsArray()
  evidence?: EvidenceDto[];
}

export class TestRunResultDto {
  @ApiProperty()
  @IsString()
  testCaseId: string;

  @ApiProperty({ enum: ['passed', 'failed', 'blocked', 'skipped'] })
  @IsString()
  status: 'passed' | 'failed' | 'blocked' | 'skipped';

  @ApiProperty({ type: [StepResultDto] })
  @IsArray()
  stepResults: StepResultDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  executedAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  duration?: number;
}
