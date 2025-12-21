import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { UpdateResultadoRequisitoDto } from './dto/update-resultado-requisito.dto';
import { ResultadoRequisito } from './entities/resultado-requisito.entity';

@Injectable()
export class ResultadoRequisitoService {
  constructor(
    @InjectRepository(ResultadoRequisito)
    private resultadoRequisitoRepository: Repository<ResultadoRequisito>,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  create(
    requisitoId: number,
    resultadoFinal:
      | 'DEVE SER FEITO'
      | 'PERFORMANCE'
      | 'ATRATIVO'
      | 'INDIFERENTE'
      | 'QUESTIONAVEL'
      | 'REVERSO',
  ) {
    return this.resultadoRequisitoRepository.save({
      requisitoFuncional: { id: requisitoId },
      resultadoFinal,
    });
  }

  findAll() {
    return `This action returns all resultadoRequisito`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resultadoRequisito`;
  }

  update(id: number, updateResultadoRequisitoDto: UpdateResultadoRequisitoDto) {
    return `This action updates a #${id} resultadoRequisito`;
  }

  remove(id: number) {
    return `This action removes a #${id} resultadoRequisito`;
  }
}
