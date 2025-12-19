import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateComentarioDto {
  @IsString()
  @IsNotEmpty()
  comentario: string;

  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  mentionUsuarioIds?: number[];
}
