import { Injectable } from '@nestjs/common';
import { CreateCasoDeTesteDto } from './dto/create-caso-de-teste.dto';
import { UpdateCasoDeTesteDto } from './dto/update-caso-de-teste.dto';

@Injectable()
export class CasoDeTesteService {
  create(createCasoDeTesteDto: CreateCasoDeTesteDto) {
    return 'This action adds a new casoDeTeste';
  }

  findAll() {
    return `This action returns all casoDeTeste`;
  }

  findOne(id: number) {
    return `This action returns a #${id} casoDeTeste`;
  }

  update(id: number, updateCasoDeTesteDto: UpdateCasoDeTesteDto) {
    return `This action updates a #${id} casoDeTeste`;
  }

  remove(id: number) {
    return `This action removes a #${id} casoDeTeste`;
  }
}
