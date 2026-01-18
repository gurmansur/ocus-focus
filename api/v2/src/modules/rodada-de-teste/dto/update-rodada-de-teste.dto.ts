import { PartialType } from '@nestjs/swagger';
import { CreateRodadaDeTesteDto } from './create-rodada-de-teste.dto';

export class UpdateRodadaDeTesteDto extends PartialType(
  CreateRodadaDeTesteDto,
) {}
