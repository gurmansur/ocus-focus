import { Injectable } from '@nestjs/common';
import { CreatePlanoDeTesteDto } from './dto/create-plano-de-teste.dto';
import { UpdatePlanoDeTesteDto } from './dto/update-plano-de-teste.dto';

@Injectable()
export class PlanoDeTesteService {
  create(createPlanoDeTesteDto: CreatePlanoDeTesteDto) {
    return 'This action adds a new planoDeTeste';
  }

  findAll() {
    return `This action returns all planoDeTeste`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planoDeTeste`;
  }

  update(id: number, updatePlanoDeTesteDto: UpdatePlanoDeTesteDto) {
    return `This action updates a #${id} planoDeTeste`;
  }

  remove(id: number) {
    return `This action removes a #${id} planoDeTeste`;
  }
}
