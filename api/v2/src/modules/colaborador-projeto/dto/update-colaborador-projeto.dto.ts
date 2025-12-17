import { PartialType } from '@nestjs/mapped-types';
import { CreateColaboradorProjetoDto } from './create-colaborador-projeto.dto';

export class UpdateColaboradorProjetoDto extends PartialType(
  CreateColaboradorProjetoDto,
) {}
