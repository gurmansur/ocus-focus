import { PartialType } from '@nestjs/mapped-types';
import { CreateResultadoRequisitoDto } from './create-resultado-requisito.dto';

export class UpdateResultadoRequisitoDto extends PartialType(CreateResultadoRequisitoDto) {}
