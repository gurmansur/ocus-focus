/**
 * @deprecated This module is deprecated. Please use the 'usuario' module instead.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateColaboradorDto } from './create-colaborador.dto';

export class UpdateColaboradorDto extends PartialType(CreateColaboradorDto) {}
