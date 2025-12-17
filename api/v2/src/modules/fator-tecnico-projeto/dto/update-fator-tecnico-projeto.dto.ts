import { PartialType } from '@nestjs/mapped-types';
import { CreateFatorTecnicoProjetoDto } from './create-fator-tecnico-projeto.dto';

export class UpdateFatorTecnicoProjetoDto extends PartialType(
  CreateFatorTecnicoProjetoDto,
) {}
