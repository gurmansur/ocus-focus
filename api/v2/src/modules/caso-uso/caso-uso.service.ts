import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
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
    @Inject('ILogger') private logger: ILogger,
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
    const parsedPage =
      Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 0;
    const parsedPageSize =
      Number.isFinite(Number(pageSize)) && Number(pageSize) > 0
        ? Number(pageSize)
        : undefined;

    const take = parsedPageSize;
    const skip = take ? parsedPage * take : 0;
    const [items, count] = await this.casoUsoRepository.findAndCount({
      where: {
        requisitoFuncional: {
          id: requisitoId ? requisitoId : undefined,
          projeto: { id: projeto.id },
        },
      },
      relations: ['requisitoFuncional', 'requisitoFuncional.projeto'],
      take,
      skip: take ? skip : undefined,
    });

    const pageSizeResult = take ?? count;
    const totalPages = take ? Math.ceil(count / take) : count > 0 ? 1 : 0;

    return {
      items,
      page: {
        size: pageSizeResult,
        totalElements: count,
        totalPages,
        number: parsedPage,
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
