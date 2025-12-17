import { PartialType } from '@nestjs/swagger';
import { CreateExecucaoDeTesteDto } from './create-execucao-de-teste.dto';

export class UpdateExecucaoDeTesteDto extends PartialType(
  CreateExecucaoDeTesteDto,
) {}
