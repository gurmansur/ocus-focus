import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusPriorizacaoDto } from './create-status-priorizacao.dto';

export class UpdateStatusPriorizacaoDto extends PartialType(
  CreateStatusPriorizacaoDto,
) {}
