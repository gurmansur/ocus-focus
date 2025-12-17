import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProjetoService } from '../projeto/projeto.service';
import { CreateAtorDto } from './dto/create-ator.dto';
import { UpdateAtorDto } from './dto/update-ator.dto';
import { Ator } from './entities/ator.entity';

@Injectable()
export class AtorService {
  constructor(
    @InjectRepository(Ator) private readonly atorRepository: Repository<Ator>,
    @Inject() private readonly projetoService: ProjetoService,
  ) {}

  async create(createAtorDto: CreateAtorDto, projectId: number) {
    const projeto = await this.projetoService.findOne(projectId);
    if (!projeto) return 'Projeto não encontrado';

    const ator = this.atorRepository.create({ ...createAtorDto, projeto });
    return await this.atorRepository.save(ator);
  }

  async findAll(projectId: number, page = 0, pageSize = 10) {
    const take = pageSize ? pageSize : 10;
    const skip = page ? page * take : 0;
    const [items, count] = await this.atorRepository.findAndCount({
      where: { projeto: { id: projectId } },
      take,
      skip,
    });

    return {
      items,
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  async findOne(id: number) {
    return await this.atorRepository.findOne({ where: { id } });
  }

  async findByNome(nome: string, projectId: number, page = 0, pageSize = 10) {
    const take = pageSize ? pageSize : 10;
    const skip = page ? page * take : 0;
    const [items, count] = await this.atorRepository.findAndCount({
      where: { projeto: { id: projectId }, nome: Like(`%${nome}%`) },
      take,
      skip,
    });

    return {
      items,
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  async getMetrics(
    projectId: number,
    option?: 'SIMPLES' | 'MEDIO' | 'COMPLEXO',
  ) {
    const totalCount = await this.atorRepository.count({
      where: { projeto: { id: projectId }, complexidade: option },
    });

    return { totalCount };
  }

  async update(id: number, projectId: number, updateAtorDto: UpdateAtorDto) {
    const projeto = await this.projetoService.findOne(projectId);
    if (!projeto) return 'Projeto não encontrado';

    return this.atorRepository.update(id, { ...updateAtorDto, projeto });
  }

  remove(id: number) {
    return this.atorRepository.delete(id);
  }
}
