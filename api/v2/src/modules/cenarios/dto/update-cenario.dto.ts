import { PartialType } from '@nestjs/mapped-types';
import { CreateCenarioDto } from './create-cenario.dto';

export class UpdateCenarioDto extends PartialType(CreateCenarioDto) {}
