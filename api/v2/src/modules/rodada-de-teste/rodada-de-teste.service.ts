import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateRodadaDeTesteDto } from './dto/create-rodada-de-teste.dto';
import { UpdateRodadaDeTesteDto } from './dto/update-rodada-de-teste.dto';
import { UpdateRodadaResultadosDto } from './dto/update-rodada-resultados.dto';
import { RodadaDeTeste } from './entities/rodada-de-teste.entity';
import { RodadaDeTesteMapper } from './rodada-de-teste.mapper';

@Injectable()
export class RodadaDeTesteService {
  constructor(
    @InjectRepository(RodadaDeTeste)
    private readonly rodadaRepository: Repository<RodadaDeTeste>,
  ) {}

  async create(dto: CreateRodadaDeTesteDto, projeto: Projeto) {
    const entity = RodadaDeTesteMapper.createDtoToEntity(dto);
    entity.projeto = projeto;
    const saved = await this.rodadaRepository.save(entity);
    return this.findOne(saved.id, projeto);
  }

  async findAll(projeto: Projeto) {
    return this.rodadaRepository.find({
      where: { projeto: { id: projeto.id } },
      order: { dataCriacao: 'DESC' },
    });
  }

  async findOne(id: number, projeto: Projeto) {
    const entity = await this.rodadaRepository.findOne({
      where: { id, projeto: { id: projeto.id } },
    });

    if (!entity) {
      throw new NotFoundException('Rodada de teste não encontrada');
    }

    return entity;
  }

  async update(id: number, dto: UpdateRodadaDeTesteDto, projeto: Projeto) {
    const entity = await this.findOne(id, projeto);
    const partial = RodadaDeTesteMapper.updateDtoToEntity(dto);
    const merged = this.rodadaRepository.merge(entity, partial);
    return this.rodadaRepository.save(merged);
  }

  async updateResultados(
    id: number,
    dto: UpdateRodadaResultadosDto,
    projeto: Projeto,
  ) {
    const entity = await this.findOne(id, projeto);
    const merged = RodadaDeTesteMapper.mergeResultados(entity, dto);
    return this.rodadaRepository.save(merged);
  }

  async remove(id: number, projeto: Projeto) {
    const entity = await this.findOne(id, projeto);
    await this.rodadaRepository.softRemove(entity);
    return { success: true };
  }
}
