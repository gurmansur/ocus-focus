import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExecucaoDeTesteDto } from './dto/create-execucao-de-teste.dto';
import { UpdateExecucaoDeTesteDto } from './dto/update-execucao-de-teste.dto';
import { ExecucaoDeTeste } from './entities/execucao-de-teste.entity';

@Injectable()
export class ExecucaoDeTesteService {
  constructor(
    @InjectRepository(ExecucaoDeTeste)
    private execucaoDeTesteRepository: Repository<ExecucaoDeTeste>,
  ) {}

  create(createExecucaoDeTesteDto: CreateExecucaoDeTesteDto) {
    return 'This action adds a new execucaoDeTeste';
  }

  findAll() {
    return this.execucaoDeTesteRepository.find();
  }

  findOne(id: number) {
    return this.execucaoDeTesteRepository.findOne({ where: { id } });
  }

  update(id: number, updateExecucaoDeTesteDto: UpdateExecucaoDeTesteDto) {
    return `This action updates a #${id} execucaoDeTeste`;
  }

  remove(id: number) {
    return this.execucaoDeTesteRepository.softDelete(id);
  }
}
