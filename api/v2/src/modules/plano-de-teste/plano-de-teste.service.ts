import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { SuiteDeTeste } from '../suite-de-teste/entities/suite-de-teste.entity';
import { CreatePlanoDeTesteDto } from './dto/create-plano-de-teste.dto';
import { UpdatePlanoDeTesteDto } from './dto/update-plano-de-teste.dto';
import { PlanoDeTeste } from './entities/plano-de-teste.entity';
import { PlanoDeTesteMapper } from './plano-de-teste.mapper';

@Injectable()
export class PlanoDeTesteService {
  constructor(
    @InjectRepository(PlanoDeTeste)
    private readonly planoRepository: Repository<PlanoDeTeste>,
    @InjectRepository(SuiteDeTeste)
    private readonly suiteRepository: Repository<SuiteDeTeste>,
  ) {}

  async create(dto: CreatePlanoDeTesteDto, projeto: Projeto) {
    const entity = PlanoDeTesteMapper.createDtoToEntity(dto);
    entity.projeto = projeto;

    if (dto.suitesIds?.length) {
      entity.suites = await this.loadSuites(dto.suitesIds, projeto);
    }

    const saved = await this.planoRepository.save(entity);
    return this.planoRepository.findOne({
      where: { id: saved.id },
      relations: ['suites'],
    });
  }

  async findAll(projeto: Projeto) {
    return this.planoRepository.find({
      where: { projeto: { id: projeto.id } },
      relations: ['suites'],
      order: { dataCriacao: 'DESC' },
    });
  }

  async findOne(id: number, projeto: Projeto) {
    const plano = await this.planoRepository.findOne({
      where: { id, projeto: { id: projeto.id } },
      relations: ['suites'],
    });

    if (!plano) {
      throw new NotFoundException('Plano de teste não encontrado');
    }

    return plano;
  }

  async update(id: number, dto: UpdatePlanoDeTesteDto, projeto: Projeto) {
    const plano = await this.findOne(id, projeto);
    const partial = PlanoDeTesteMapper.updateDtoToEntity(dto);

    if (dto.suitesIds) {
      plano.suites = await this.loadSuites(dto.suitesIds, projeto);
    }

    const merged = this.planoRepository.merge(plano, partial);
    return this.planoRepository.save(merged);
  }

  async remove(id: number, projeto: Projeto) {
    const plano = await this.findOne(id, projeto);
    await this.planoRepository.softRemove(plano);
    return { success: true };
  }

  private async loadSuites(ids: number[], projeto: Projeto) {
    if (!ids?.length) return [];

    const suites = await this.suiteRepository.find({
      where: { id: In(ids), projeto: { id: projeto.id } },
    });

    if (suites.length !== ids.length) {
      throw new NotFoundException(
        'Algumas suites informadas não pertencem ao projeto',
      );
    }

    return suites;
  }
}
