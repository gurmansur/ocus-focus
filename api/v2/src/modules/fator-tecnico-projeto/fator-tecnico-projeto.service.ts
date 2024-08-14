import { Injectable } from '@nestjs/common';
import { CreateFatorTecnicoProjetoDto } from './dto/create-fator-tecnico-projeto.dto';
import { UpdateFatorTecnicoProjetoDto } from './dto/update-fator-tecnico-projeto.dto';

@Injectable()
export class FatorTecnicoProjetoService {
  create(createFatorTecnicoProjetoDto: CreateFatorTecnicoProjetoDto) {
    return 'This action adds a new fatorTecnicoProjeto';
  }

  findAll() {
    return `This action returns all fatorTecnicoProjeto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fatorTecnicoProjeto`;
  }

  update(id: number, updateFatorTecnicoProjetoDto: UpdateFatorTecnicoProjetoDto) {
    return `This action updates a #${id} fatorTecnicoProjeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} fatorTecnicoProjeto`;
  }
}
