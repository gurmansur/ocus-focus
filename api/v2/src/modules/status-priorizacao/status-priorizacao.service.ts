import { Injectable } from '@nestjs/common';
import { CreateStatusPriorizacaoDto } from './dto/create-status-priorizacao.dto';
import { UpdateStatusPriorizacaoDto } from './dto/update-status-priorizacao.dto';

@Injectable()
export class StatusPriorizacaoService {
  create(createStatusPriorizacaoDto: CreateStatusPriorizacaoDto) {
    return 'This action adds a new statusPriorizacao';
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
