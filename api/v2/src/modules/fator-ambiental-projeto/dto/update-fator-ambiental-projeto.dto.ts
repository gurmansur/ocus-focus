import { PartialType } from '@nestjs/mapped-types';
import { CreateFatorAmbientalProjetoDto } from './create-fator-ambiental-projeto.dto';

export class UpdateFatorAmbientalProjetoDto extends PartialType(
  CreateFatorAmbientalProjetoDto,
) {}
