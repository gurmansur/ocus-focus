import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stakeholder } from '../stakeholder/entities/stakeholder.entity';
import { UpdateStatusPriorizacaoDto } from './dto/update-status-priorizacao.dto';
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

  update(id: number, updateStatusPriorizacaoDto: UpdateStatusPriorizacaoDto) {
    return `This action updates a #${id} statusPriorizacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} statusPriorizacao`;
  }
}
