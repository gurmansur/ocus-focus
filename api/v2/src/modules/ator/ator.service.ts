import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(createAtorDto: CreateAtorDto) {
    const ator = this.atorRepository.create(createAtorDto);
    return await this.atorRepository.save(ator);
  }

  async findAll(paginated = false, page = 1) {
    if (paginated) {
      const take = 10;
      const skip = (page - 1) * take;
      return await this.atorRepository.findAndCount({
        take,
        skip,
      });
    }
    return await this.atorRepository.findAndCount();
  }

  async findOne(id: number) {
    return await this.atorRepository.findOne({ where: { id } });
  }

  async findByNome(nome: string) {
    return await this.atorRepository.find({ where: { nome } });
  }

  getMetrics(projectId: number, option?: 'SIMPLES' | 'MEDIO' | 'COMPLEXO') {
    return this.atorRepository.count({
      where: { projeto: { id: projectId }, complexidade: option },
    });
  }

  async update(id: number, projectId: number, updateAtorDto: UpdateAtorDto) {
    const projeto = await this.projetoService.findOne(projectId);
    if (!projeto) return 'Projeto não encontrado';
    updateAtorDto.projeto = projeto;

    return this.atorRepository.update(id, updateAtorDto);
  }

  remove(id: number) {
    return this.atorRepository.delete(id);
  }
}
