import { IsBoolean, IsNumber } from 'class-validator';
import { Colaborador } from 'src/modules/colaborador/entities/colaborador.entity';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';

export class CreateColaboradorProjetoDto {
  @IsBoolean()
  ativo: boolean;

  @IsBoolean()
  administrador: boolean;

  @IsNumber()
  colaborador: Colaborador;

  @IsNumber()
  usuario: Usuario;

  @IsNumber()
  projeto: Projeto;
}
