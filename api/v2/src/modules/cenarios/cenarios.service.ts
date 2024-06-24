import { Injectable } from '@nestjs/common';
import { CreateCenarioDto } from './dto/create-cenario.dto';
import { UpdateCenarioDto } from './dto/update-cenario.dto';

@Injectable()
export class CenariosService {
  create(createCenarioDto: CreateCenarioDto) {
    return 'This action adds a new cenario';
  }

  findAll() {
    return `This action returns all cenarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cenario`;
  }

  update(id: number, updateCenarioDto: UpdateCenarioDto) {
    return `This action updates a #${id} cenario`;
  }

  remove(id: number) {
    return `This action removes a #${id} cenario`;
  }
}
