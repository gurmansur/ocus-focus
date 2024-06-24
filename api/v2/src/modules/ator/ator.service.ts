import { Injectable } from '@nestjs/common';
import { CreateAtorDto } from './dto/create-ator.dto';
import { UpdateAtorDto } from './dto/update-ator.dto';

@Injectable()
export class AtorService {
  create(createAtorDto: CreateAtorDto) {
    return 'This action adds a new ator';
  }

  findAll() {
    return `This action returns all ator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ator`;
  }

  update(id: number, updateAtorDto: UpdateAtorDto) {
    return `This action updates a #${id} ator`;
  }

  remove(id: number) {
    return `This action removes a #${id} ator`;
  }
}
