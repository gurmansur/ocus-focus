import { Injectable } from '@nestjs/common';
import { CreateResultadoRequisitoDto } from './dto/create-resultado-requisito.dto';
import { UpdateResultadoRequisitoDto } from './dto/update-resultado-requisito.dto';

@Injectable()
export class ResultadoRequisitoService {
  create(createResultadoRequisitoDto: CreateResultadoRequisitoDto) {
    return 'This action adds a new resultadoRequisito';
  }

  findAll() {
    return `This action returns all resultadoRequisito`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resultadoRequisito`;
  }

  update(id: number, updateResultadoRequisitoDto: UpdateResultadoRequisitoDto) {
    return `This action updates a #${id} resultadoRequisito`;
  }

  remove(id: number) {
    return `This action removes a #${id} resultadoRequisito`;
  }
}
