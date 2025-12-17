import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CasoUsoService } from '../caso-uso/caso-uso.service';
import { CreateCenarioDto } from './dto/create-cenario.dto';
import { UpdateCenarioDto } from './dto/update-cenario.dto';
import { Cenario } from './entities/cenario.entity';

@Injectable()
export class CenariosService {
  constructor(
    @InjectRepository(Cenario)
    private readonly cenarioRepository: Repository<Cenario>,
    @Inject() private readonly casosUsoService: CasoUsoService,
  ) {}

  async findAll(casoId: number, page = 0, pageSize = 10) {
    const take = pageSize ? pageSize : 10;
    const skip = page ? page * take : 0;
    const [items, count] = await this.cenarioRepository.findAndCount({
      where: { casoUso: { id: casoId } },
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
    try {
      return await this.cenarioRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      if (!id) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByNome(nome: string) {
    try {
      return await this.cenarioRepository.find({ where: { nome } });
    } catch (error) {
      console.error(error);
      if (!nome) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createCenarioDto: CreateCenarioDto, casoId: number) {
    const cenario = this.cenarioRepository.create({
      ...createCenarioDto,
      casoUso: { id: casoId },
    });
    return await this.cenarioRepository.save(cenario);
  }

  async update(id: number, casoId: number, updateCenarioDto: UpdateCenarioDto) {
    const caso = await this.casosUsoService.findOne(casoId);
    if (!caso) return 'Caso não encontrado';
    return this.cenarioRepository.update(id, {
      ...updateCenarioDto,
      casoUso: caso,
    });
  }

  remove(id: number) {
    try {
      return this.cenarioRepository.delete(id);
    } catch (error) {
      if (!id) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
