import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { RequisitoService } from '../requisito/requisito-funcional.service';
import { CreateCasoUsoDto } from './dto/create-caso-uso.dto';
import { UpdateCasoUsoDto } from './dto/update-caso-uso.dto';
import { CasoUso } from './entities/caso-uso.entity';

@Injectable()
export class CasoUsoService {
  constructor(
    @InjectRepository(CasoUso)
    private readonly casoUsoRepository: Repository<CasoUso>,
    @Inject() private readonly requisitosService: RequisitoService,
  ) {}

  async create(createCasoUsoDto: CreateCasoUsoDto, requisitoId: number) {
    const casoUso = this.casoUsoRepository.create(createCasoUsoDto);
    const requisito = await this.requisitosService.getById(requisitoId);

    if (!requisito)
      throw new HttpException('Requisito não encontrado', HttpStatus.NOT_FOUND);

    casoUso.requisitoFuncional = requisito;

    return await this.casoUsoRepository.save(casoUso);
  }

  async findAll(
    requisitoId: number,
    page: number,
    pageSize: number,
    projeto: Projeto,
  ) {
    const take = pageSize ? pageSize : undefined;
    const skip = page ? page * take : undefined;
    const [items, count] = await this.casoUsoRepository.findAndCount({
      where: {
        requisitoFuncional: {
          id: requisitoId ? requisitoId : undefined,
          projeto: { id: projeto.id },
        },
      },
      relations: ['requisitoFuncional', 'requisitoFuncional.projeto'],
      take: !!take ? take : undefined,
      skip: !!skip ? skip : undefined,
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

  async findByNome(nome: string) {
    try {
      return await this.casoUsoRepository.find({ where: { nome } });
    } catch (error) {
      console.error(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      return await this.casoUsoRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      if (!id) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMetrics(
    requisitoFuncional: number,
    option?: 'SIMPLES' | 'MEDIO' | 'COMPLEXO',
  ) {
    return {
      totalCount: await this.casoUsoRepository.count({
        where: {
          requisitoFuncional: { id: requisitoFuncional },
          complexidade: option,
        },
      }),
    };
  }

  async update(
    id: number,
    requisitoId: number,
    updateCasoUsoDto: UpdateCasoUsoDto,
  ) {
    const requisito = await this.requisitosService.getById(requisitoId);
    if (!requisito) return 'Projeto não encontrado';

    return this.casoUsoRepository.update(id, {
      ...updateCasoUsoDto,
      requisitoFuncional: requisito,
    });
  }

  remove(id: number) {
    try {
      return this.casoUsoRepository.delete(id);
    } catch (error) {
      if (!id) throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
