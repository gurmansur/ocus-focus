import { PartialType } from '@nestjs/swagger';
import { CreateAcaoDeTesteDto } from './create-acao-de-teste.dto';

export class UpdateAcaoDeTesteDto extends PartialType(CreateAcaoDeTesteDto) {}
