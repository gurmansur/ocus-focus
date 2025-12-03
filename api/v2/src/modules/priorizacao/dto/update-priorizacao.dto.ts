import { PartialType } from '@nestjs/mapped-types';
import { CreatePriorizacaoDto } from './create-priorizacao.dto';

export class UpdatePriorizacaoDto extends PartialType(CreatePriorizacaoDto) {}
