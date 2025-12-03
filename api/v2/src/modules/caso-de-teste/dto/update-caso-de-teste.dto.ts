import { PartialType } from '@nestjs/swagger';
import { CreateCasoDeTesteDto } from './create-caso-de-teste.dto';

export class UpdateCasoDeTesteDto extends PartialType(CreateCasoDeTesteDto) {}
