import { PartialType } from '@nestjs/mapped-types';
import { CreateCasoUsoDto } from './create-caso-uso.dto';

export class UpdateCasoUsoDto extends PartialType(CreateCasoUsoDto) {}
