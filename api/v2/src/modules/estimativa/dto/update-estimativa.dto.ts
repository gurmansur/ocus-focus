import { PartialType } from '@nestjs/mapped-types';
import { CreateEstimativaDto } from './create-estimativa.dto';

export class UpdateEstimativaDto extends PartialType(CreateEstimativaDto) {}
