import { Injectable } from '@nestjs/common';
import { CreateCasoUsoDto } from './dto/create-caso-uso.dto';
import { UpdateCasoUsoDto } from './dto/update-caso-uso.dto';

@Injectable()
export class CasoUsoService {
  create(createCasoUsoDto: CreateCasoUsoDto) {
    return 'This action adds a new casoUso';
  }

  findAll() {
    return `This action returns all casoUso`;
  }

  findOne(id: number) {
    return `This action returns a #${id} casoUso`;
  }

  update(id: number, updateCasoUsoDto: UpdateCasoUsoDto) {
    return `This action updates a #${id} casoUso`;
  }

  remove(id: number) {
    return `This action removes a #${id} casoUso`;
  }
}
