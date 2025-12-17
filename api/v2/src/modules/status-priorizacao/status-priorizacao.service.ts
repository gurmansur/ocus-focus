import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stakeholder } from '../stakeholder/entities/stakeholder.entity';
import { StatusPriorizacao } from './entities/status-priorizacao.entity';

@Injectable()
export class StatusPriorizacaoService {
  constructor(
    @InjectRepository(StatusPriorizacao)
    private readonly statusPriorizacaoRepository: Repository<StatusPriorizacao>,
  ) {}

  create(stakeholder: Stakeholder) {
    return this.statusPriorizacaoRepository.save({
      stakeholder: stakeholder,
      usuario: stakeholder.usuario,
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
        stakeholder: { id: id },
      },
      {
        alertaEmitido: true,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} statusPriorizacao`;
  }

  findByStakeholder(stakeholderId: number) {
    return this.statusPriorizacaoRepository.find({
      where: { stakeholder: { id: stakeholderId } },
    });
  }

  deleteByStakeholder(stakeholderId: number) {
    return this.statusPriorizacaoRepository.delete({
      stakeholder: { id: stakeholderId },
    });
  }

  verifyParticipation(projetoId: number) {
    return this.statusPriorizacaoRepository.find({
      relations: ['stakeholder'],
      where: {
        stakeholder: { projeto: { id: projetoId } },
        participacaoRealizada: false,
      },
    });
  }

  updateParticipation(stakeholderId: number) {
    return this.statusPriorizacaoRepository.update(
      {
        stakeholder: { id: stakeholderId },
      },
      {
        participacaoRealizada: true,
      },
    );
  }
}
