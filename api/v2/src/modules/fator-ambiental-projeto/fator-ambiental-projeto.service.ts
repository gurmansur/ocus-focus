import { Injectable } from '@nestjs/common';
import { CreateFatorAmbientalProjetoDto } from './dto/create-fator-ambiental-projeto.dto';
import { UpdateFatorAmbientalProjetoDto } from './dto/update-fator-ambiental-projeto.dto';

@Injectable()
export class FatorAmbientalProjetoService {
  create(createFatorAmbientalProjetoDto: CreateFatorAmbientalProjetoDto) {
    return 'This action adds a new fatorAmbientalProjeto';
  }

  findAll() {
    return `This action returns all fatorAmbientalProjeto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fatorAmbientalProjeto`;
  }

  update(id: number, updateFatorAmbientalProjetoDto: UpdateFatorAmbientalProjetoDto) {
    return `This action updates a #${id} fatorAmbientalProjeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} fatorAmbientalProjeto`;
  }
}
