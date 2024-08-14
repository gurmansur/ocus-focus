import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateUsuarioDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dataCadastro: Date;
}
