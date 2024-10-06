import { Injectable } from '@nestjs/common';
import { CreateExecucaoDeTesteDto } from './dto/create-execucao-de-teste.dto';
import { UpdateExecucaoDeTesteDto } from './dto/update-execucao-de-teste.dto';

@Injectable()
export class ExecucaoDeTesteService {
  create(createExecucaoDeTesteDto: CreateExecucaoDeTesteDto) {
    return 'This action adds a new execucaoDeTeste';
  }

  findAll() {
    return `This action returns all execucaoDeTeste`;
  }

  findOne(id: number) {
    return `This action returns a #${id} execucaoDeTeste`;
  }

  update(id: number, updateExecucaoDeTesteDto: UpdateExecucaoDeTesteDto) {
    return `This action updates a #${id} execucaoDeTeste`;
  }

  remove(id: number) {
    return `This action removes a #${id} execucaoDeTeste`;
  }
}
