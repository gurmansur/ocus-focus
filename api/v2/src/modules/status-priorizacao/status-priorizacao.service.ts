import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { StatusPriorizacao } from './entities/status-priorizacao.entity';

@Injectable()
export class StatusPriorizacaoService {
  constructor(
    @InjectRepository(StatusPriorizacao)
    private readonly statusPriorizacaoRepository: Repository<StatusPriorizacao>,
  ) {}

  create(usuario: Usuario, projeto?: Projeto) {
    return this.statusPriorizacaoRepository.save({
      usuario: usuario,
      projeto: projeto,
    });
  }

  findAll() {
    return `This action returns all statusPriorizacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statusPriorizacao`;
  }

  update(id: number) {
    return this.statusPriorizacaoRepository.update(
      {
        usuario: { id: id },
      },
      {
        alertaEmitido: true,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} statusPriorizacao`;
  }

  findByStakeholder(usuarioId: number) {
    return this.statusPriorizacaoRepository.find({
      where: { usuario: { id: usuarioId } },
    });
  }

  deleteByStakeholder(usuarioId: number) {
    return this.statusPriorizacaoRepository.delete({
      usuario: { id: usuarioId },
    });
  }

  verifyParticipation(projetoId: number) {
    return this.statusPriorizacaoRepository.find({
      where: {
        projeto: { id: projetoId },
        participacaoRealizada: false,
      },
    });
  }

  updateParticipation(usuarioId: number) {
    return this.statusPriorizacaoRepository.update(
      {
        usuario: { id: usuarioId },
      },
      {
        participacaoRealizada: true,
      },
    );
  }
}
