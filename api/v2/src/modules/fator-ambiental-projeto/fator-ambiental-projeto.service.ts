import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatorAmbiental } from '../fatores-ambientais/entities/fatores-ambientais.entity';
import { CreateFatorAmbientalProjetoDto } from './dto/create-fator-ambiental-projeto.dto';
import { UpdateFatorAmbientalProjetoDto } from './dto/update-fator-ambiental-projeto.dto';
import { FatorAmbientalProjeto } from './entities/fator-ambiental-projeto.entity';

@Injectable()
export class FatorAmbientalProjetoService {
  constructor(
    @InjectRepository(FatorAmbientalProjeto)
    private readonly fatorAmbientalRepository: Repository<FatorAmbientalProjeto>,
    @InjectRepository(FatorAmbiental)
    private readonly fatoresAmbientais: Repository<FatorAmbiental>,
  ) {}

  // TODO tem que pegar o ID do repository e não está pegando, talvez por ser um objeto
  async findAll(projetoId: number, page = 0, pageSize = 10) {
    try {
      const take = pageSize ? pageSize : 10;
      const skip = page ? page * take : 0;
      const [items, count] = await this.fatorAmbientalRepository.findAndCount({
        where: { projeto: { id: projetoId } },
        relations: ['fatorAmbiental'],
        take,
        skip,
      });

      return {
        items: items.map((item) => {
          return {
            id: item.id,
            descricao: item.fatorAmbiental.descricao,
            peso: item.fatorAmbiental.peso,
            valor: item.valor,
          };
        }),
        page: {
          size: take,
          totalElements: count,
          totalPages: Math.ceil(count / take),
          number: page ? page : 0,
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getById(id: number) {
    const fator = await this.fatorAmbientalRepository.findOne({
      where: { id },
    });

    return {
      valor: fator.valor,
      id: fator.id,
    };
  }

  async create(
    projetoId: number,
    createFatorAmbientalProjetoDto: CreateFatorAmbientalProjetoDto,
  ) {
    const fator = this.fatorAmbientalRepository.create({
      fatorAmbiental: { id: createFatorAmbientalProjetoDto.fatorAmb },
      valor: createFatorAmbientalProjetoDto.valor,
      projeto: { id: projetoId },
    });

    return await this.fatorAmbientalRepository.save(fator);
  }

  async update(
    id: number,
    updateFatorAmbientalProjetoDto: UpdateFatorAmbientalProjetoDto,
  ) {
    const fator = await this.fatorAmbientalRepository.findOne({
      where: {
        id,
      },
    });

    return await this.fatorAmbientalRepository.update(id, {
      valor: updateFatorAmbientalProjetoDto.valor,
    });
  }

  async remove(id: number) {
    return await this.fatorAmbientalRepository.delete(id);
  }
}
