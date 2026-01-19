/**
 * @deprecated This module is deprecated. Please use the 'usuario' module instead.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateColaboradorProjetoDto } from './create-colaborador-projeto.dto';

export class UpdateColaboradorProjetoDto extends PartialType(
  CreateColaboradorProjetoDto,
) {}
