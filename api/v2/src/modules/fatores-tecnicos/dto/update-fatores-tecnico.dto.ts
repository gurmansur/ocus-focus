import { PartialType } from '@nestjs/mapped-types';
import { CreateFatoresTecnicoDto } from './create-fatores-tecnico.dto';

export class UpdateFatoresTecnicoDto extends PartialType(CreateFatoresTecnicoDto) {}
