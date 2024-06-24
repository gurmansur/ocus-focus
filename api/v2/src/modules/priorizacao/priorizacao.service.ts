import { Injectable } from '@nestjs/common';
import { CreatePriorizacaoDto } from './dto/create-priorizacao.dto';
import { UpdatePriorizacaoDto } from './dto/update-priorizacao.dto';

@Injectable()
export class PriorizacaoService {
  create(createPriorizacaoDto: CreatePriorizacaoDto) {
    return 'This action adds a new priorizacao';
  }

  findAll() {
    return `This action returns all priorizacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} priorizacao`;
  }

  update(id: number, updatePriorizacaoDto: UpdatePriorizacaoDto) {
    return `This action updates a #${id} priorizacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} priorizacao`;
  }
}
