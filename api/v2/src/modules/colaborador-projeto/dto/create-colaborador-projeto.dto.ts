import { IsBoolean, IsNumber } from 'class-validator';
import { Colaborador } from '../../colaborador/entities/colaborador.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

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
