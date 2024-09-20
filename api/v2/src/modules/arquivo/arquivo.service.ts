import { Injectable } from '@nestjs/common';
import { CreateArquivoDto } from './dto/create-arquivo.dto';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';

@Injectable()
export class ArquivoService {
  create(createArquivoDto: CreateArquivoDto) {
    return 'This action adds a new arquivo';
  }

  findAll() {
    return `This action returns all arquivo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} arquivo`;
  }

  update(id: number, updateArquivoDto: UpdateArquivoDto) {
    return `This action updates a #${id} arquivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} arquivo`;
  }
}
