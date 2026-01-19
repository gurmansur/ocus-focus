/**
 * @deprecated This module is deprecated. Please use the 'usuario' module instead.
 */
import { Projeto } from '../projeto/entities/projeto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { Stakeholder } from './entities/stakeholder.entity';

export class StakeholderBuilder {
  static buildStakeholderEntityFromDto(
    stakeholder: CreateStakeholderDto,
    chave: string,
    usuario: Usuario,
    projeto: Projeto,
  ) {
    const stakeholderEntity = new Stakeholder();

    stakeholderEntity.nome = stakeholder.nome;
    stakeholderEntity.email = stakeholder.email;
    stakeholderEntity.cargo = stakeholder.cargo;
    stakeholderEntity.senha = stakeholder.senha;
    stakeholderEntity.chave = chave;
    stakeholderEntity.usuario = usuario;
    stakeholderEntity.projeto = projeto;

    return stakeholderEntity;
  }
}
