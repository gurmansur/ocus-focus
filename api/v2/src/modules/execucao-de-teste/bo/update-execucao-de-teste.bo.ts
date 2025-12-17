import { PartialType } from '@nestjs/swagger';
import { CreateExecucaoDeTesteBo } from './create-execucao-de-teste.bo';

export class UpdateExecucaoDeTesteBo extends PartialType(
  CreateExecucaoDeTesteBo,
) {}
