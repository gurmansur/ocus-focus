import { Injectable } from '@nestjs/common';
import { CreateSubtarefaDto } from './dto/create-subtarefa.dto';
import { UpdateSubtarefaDto } from './dto/update-subtarefa.dto';

@Injectable()
export class SubtarefaService {
  create(createSubtarefaDto: CreateSubtarefaDto) {
    return 'This action adds a new subtarefa';
  }

  findAll() {
    return `This action returns all subtarefa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subtarefa`;
  }

  update(id: number, updateSubtarefaDto: UpdateSubtarefaDto) {
    return `This action updates a #${id} subtarefa`;
  }

  remove(id: number) {
    return `This action removes a #${id} subtarefa`;
  }
}
