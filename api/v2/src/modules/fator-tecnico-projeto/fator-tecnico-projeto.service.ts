import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFatorTecnicoProjetoDto } from './dto/create-fator-tecnico-projeto.dto';
import { UpdateFatorTecnicoProjetoDto } from './dto/update-fator-tecnico-projeto.dto';
import { FatorTecnicoProjeto } from './entities/fator-tecnico-projeto.entity';

@Injectable()
export class FatorTecnicoProjetoService {
  constructor(
    @InjectRepository(FatorTecnicoProjeto)
    private readonly fatorTecnicoRepository: Repository<FatorTecnicoProjeto>,
  ) {}

  async findAll(projetoId: number, page = 0, pageSize = 10) {
    const take = pageSize ? pageSize : 10;
    const skip = page ? page * take : 0;
    const [items, count] = await this.fatorTecnicoRepository.findAndCount({
      where: { projeto: { id: projetoId } },
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

  async getById(id: number) {
    const fator = await this.fatorTecnicoRepository.findOne({
      where: { id },
    });

    return {
      valor: fator.valor,
      id: fator.id,
    };
  }

  async create(
    projetoId: number,
    createFatorTecnicoProjetoDto: CreateFatorTecnicoProjetoDto,
  ) {
    const fator = this.fatorTecnicoRepository.create({
      fatorTecnico: { id: createFatorTecnicoProjetoDto.fatorTec },
      valor: createFatorTecnicoProjetoDto.valor,
      projeto: { id: projetoId },
    });

    return await this.fatorTecnicoRepository.save(fator);
  }

  async update(
    id: number,
    updateFatorTecnicoProjetoDto: UpdateFatorTecnicoProjetoDto,
  ) {
    const fator = await this.fatorTecnicoRepository.findOne({
      where: {
        id,
      },
    });

    return await this.fatorTecnicoRepository.update(id, {
      valor: updateFatorTecnicoProjetoDto.valor,
    });
  }

  async remove(id: number) {
    return await this.fatorTecnicoRepository.delete(id);
  }
}
