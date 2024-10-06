import { PartialType } from '@nestjs/swagger';
import { CreatePlanoDeTesteDto } from './create-plano-de-teste.dto';

export class UpdatePlanoDeTesteDto extends PartialType(CreatePlanoDeTesteDto) {}
