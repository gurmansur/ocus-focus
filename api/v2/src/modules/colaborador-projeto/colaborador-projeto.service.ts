import { Injectable } from '@nestjs/common';
import { CreateColaboradorProjetoDto } from './dto/create-colaborador-projeto.dto';
import { UpdateColaboradorProjetoDto } from './dto/update-colaborador-projeto.dto';

@Injectable()
export class ColaboradorProjetoService {
  create(createColaboradorProjetoDto: CreateColaboradorProjetoDto) {
    return 'This action adds a new colaboradorProjeto';
  }

  findAll() {
    return `This action returns all colaboradorProjeto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} colaboradorProjeto`;
  }

  update(id: number, updateColaboradorProjetoDto: UpdateColaboradorProjetoDto) {
    return `This action updates a #${id} colaboradorProjeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} colaboradorProjeto`;
  }
}
