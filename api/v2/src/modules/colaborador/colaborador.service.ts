import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';
import { Colaborador } from './entities/colaborador.entity';

@Injectable()
export class ColaboradorService {
  constructor(
    @InjectRepository(Colaborador)
    private colaboradorRepository: Repository<Colaborador>,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  create(createColaboradorDto: CreateColaboradorDto, usuario?: Usuario) {
    this.logger.log(`Creating colaborador: ${createColaboradorDto.email}`);
    const colaborador = this.colaboradorRepository.create(createColaboradorDto);
    colaborador.usuario = usuario;
    return this.colaboradorRepository.save(colaborador);
  }

  async findAllFromProject(projetoId: number) {
    this.logger.debug(`Finding collaborators for projeto ${projetoId}`);
    return await this.colaboradorRepository.find({
      where: {
        projetos: { id: projetoId },
      },
    });
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
    this.logger.log(`Updating colaborador ${id}`);
    return `This action updates a #${id} colaborador`;
  }

  remove(id: number) {
    this.logger.warn(`Removing colaborador ${id}`);
    return `This action removes a #${id} colaborador`;
  }
}
