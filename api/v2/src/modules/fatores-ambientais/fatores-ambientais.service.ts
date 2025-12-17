import { Injectable } from '@nestjs/common';
import { CreateFatoresAmbientaiDto } from './dto/create-fatores-ambientai.dto';
import { UpdateFatoresAmbientaiDto } from './dto/update-fatores-ambientai.dto';

@Injectable()
export class FatoresAmbientaisService {
  create(createFatoresAmbientaiDto: CreateFatoresAmbientaiDto) {
    return 'This action adds a new fatoresAmbientai';
  }

  findAll() {
    return `This action returns all fatoresAmbientais`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fatoresAmbientai`;
  }

  update(id: number, updateFatoresAmbientaiDto: UpdateFatoresAmbientaiDto) {
    return `This action updates a #${id} fatoresAmbientai`;
  }

  remove(id: number) {
    return `This action removes a #${id} fatoresAmbientai`;
  }
}
