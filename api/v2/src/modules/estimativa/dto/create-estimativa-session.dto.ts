import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEstimativaSessionDto {
  @ApiProperty({
    example: 'E-commerce Platform Estimation',
    description: 'Name of the estimation session',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Use Case Points estimation for the new e-commerce platform',
    description: 'Description of the estimation session',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
