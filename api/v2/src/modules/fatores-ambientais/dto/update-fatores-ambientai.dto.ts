import { PartialType } from '@nestjs/mapped-types';
import { CreateFatoresAmbientaiDto } from './create-fatores-ambientai.dto';

export class UpdateFatoresAmbientaiDto extends PartialType(CreateFatoresAmbientaiDto) {}
