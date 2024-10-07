import { PartialType } from '@nestjs/swagger';
import { CreateCasoDeTesteBo } from './create-caso-de-teste.bo';

export class UpdateCasoDeTesteBo extends PartialType(CreateCasoDeTesteBo) {}
