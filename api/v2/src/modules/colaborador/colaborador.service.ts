import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
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

  async findAll(name?: string, projetoId?: number) {
    const inProject = await this.colaboradorRepository.find({
      where: {
        projetos: projetoId ? { projeto: { id: projetoId } } : undefined,
      },
    });

    const notInProject = await this.colaboradorRepository.find({
      where: {
        id: Not(In(inProject.map((colaborador) => colaborador.id))),
        nome: name ? Like(`%${name}%`) : undefined,
      },
    });

    return notInProject;
  }

  findByEmail(email: string) {
    return this.colaboradorRepository.findOne({ where: { email } });
  }

  findOne(id: number) {
    return this.colaboradorRepository.findOne({ where: { id } });
  }

  update(id: number, updateColaboradorDto: UpdateColaboradorDto) {
    return `This action updates a #${id} colaborador`;
  }

  remove(id: number) {
    return `This action removes a #${id} colaborador`;
  }
}
