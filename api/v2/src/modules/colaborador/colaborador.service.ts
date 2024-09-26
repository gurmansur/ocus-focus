import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';
import { Colaborador } from './entities/colaborador.entity';

@Injectable()
export class ColaboradorService {
  constructor(
    @InjectRepository(Colaborador)
    private colaboradorRepository: Repository<Colaborador>,
  ) {}

  create(createColaboradorDto: CreateColaboradorDto) {
    const colaborador = this.colaboradorRepository.create(createColaboradorDto);
    return this.colaboradorRepository.save(colaborador);
  }

  findAll() {
    return `This action returns all colaborador`;
  }

  findByEmail(email: string) {
    return this.colaboradorRepository.findOne({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} colaborador`;
  }

  update(id: number, updateColaboradorDto: UpdateColaboradorDto) {
    return `This action updates a #${id} colaborador`;
  }

  remove(id: number) {
    return `This action removes a #${id} colaborador`;
  }
}
