import { PartialType } from '@nestjs/mapped-types';
import { CreateSubtarefaDto } from './create-subtarefa.dto';

export class UpdateSubtarefaDto extends PartialType(CreateSubtarefaDto) {}
