import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ator } from '../ator/entities/ator.entity';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { ProjetoService } from '../projeto/projeto.service';
import { Estimativa } from './entities/estimativa.entity';

@Injectable()
export class EstimativaService {
  constructor(
    @InjectRepository(Estimativa)
    private readonly estimativaRepository: Repository<Estimativa>,
    @Inject() private readonly projetoService: ProjetoService,
    @InjectRepository(Ator) private readonly atorRepository: Repository<Ator>,
    @InjectRepository(CasoUso)
    private readonly casoRepository: Repository<CasoUso>,
  ) {}

  async findAll(projetoId: number, page = 0, pageSize = 10) {
    const take = pageSize ? pageSize : 10;
    const skip = page ? page * take : 0;
    const [items, count] = await this.estimativaRepository.findAndCount({
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

  async create(projetoId: number) {
    try {
      const projeto = await this.projetoService.findOne(projetoId);
      const Tfactor = projeto.restFactor;
      const Efactor = projeto.reseFactor;

      const totalCasoSimples = await this.getTotalCasosSimples(projetoId);
      const totalCasoMedio = await this.getTotalCasosMedios(projetoId);
      const totalCasoComplexo = await this.getTotalCasosComplexos(projetoId);

      const somaCasos =
        totalCasoSimples * 5 + totalCasoMedio * 10 + totalCasoComplexo * 15;

      const totalAtorSimples = await this.getTotalAtoresSimples(projetoId);
      const totalAtorMedio = await this.getTotalAtoresMedios(projetoId);
      const totalAtorComplexo = await this.getTotalAtoresComplexos(projetoId);
      const somaAtores =
        totalAtorSimples + totalAtorMedio * 2 + totalAtorComplexo * 3;

      const pesoPontos = somaCasos + somaAtores;
      const ResPontos = (somaCasos + somaAtores) * Tfactor * Efactor;
      const ResHoras = (somaCasos + somaAtores) * Tfactor * Efactor * 20;

      const options = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      const date = new Date();
      const dataHoraFormatada = date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const estimativa = await this.estimativaRepository.create({
        dataEstimativa: dataHoraFormatada,
        eFactor: Efactor,
        tFactor: Tfactor,
        pesoAtores: somaAtores,
        pesoCasosUso: somaCasos,
        pesoPontosCasosUso: pesoPontos,
        resultadoPontosCasosUso: ResPontos,
        resultadoHoras: ResHoras,
        projeto: { id: projetoId },
      });

      return await this.estimativaRepository.save(estimativa);
    } catch (error) {
      console.error(error);
      if (!projetoId)
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getTotalAtoresSimples(projetoId: number) {
    return await this.atorRepository.count({
      where: { complexidade: 'SIMPLES', projeto: { id: projetoId } },
    });
  }

  private async getTotalAtoresMedios(projetoId: number) {
    return await this.atorRepository.count({
      where: { complexidade: 'MEDIO', projeto: { id: projetoId } },
    });
  }

  private async getTotalAtoresComplexos(projetoId: number) {
    return await this.atorRepository.count({
      where: { complexidade: 'COMPLEXO', projeto: { id: projetoId } },
    });
  }

  private async getTotalCasosSimples(projetoId: number) {
    return await this.casoRepository.count({
      where: {
        complexidade: 'SIMPLES',
        requisitoFuncional: { projeto: { id: projetoId } },
      },
    });
  }

  private async getTotalCasosMedios(projetoId: number) {
    return await this.casoRepository.count({
      where: {
        complexidade: 'MEDIO',
        requisitoFuncional: { projeto: { id: projetoId } },
      },
    });
  }

  private async getTotalCasosComplexos(projetoId: number) {
    return await this.casoRepository.count({
      where: {
        complexidade: 'COMPLEXO',
        requisitoFuncional: { projeto: { id: projetoId } },
      },
    });
  }

  async getFatorDeAjuste(projetoId: number) {
    const projeto = await this.projetoService.findOne(projetoId);
    return {
      tFactor: projeto.restFactor,
      eFactor: projeto.reseFactor,
      total: projeto.restFactor * projeto.reseFactor,
    };
  }

  async getPontosDeNaoAjustados(projetoId: number) {
    const totalCasoSimples = await this.getTotalCasosSimples(projetoId);
    const totalCasoMedio = await this.getTotalCasosMedios(projetoId);
    const totalCasoComplexo = await this.getTotalCasosComplexos(projetoId);

    const somaCasos =
      totalCasoSimples * 5 + totalCasoMedio * 10 + totalCasoComplexo * 15;

    const totalAtorSimples = await this.getTotalAtoresSimples(projetoId);
    const totalAtorMedio = await this.getTotalAtoresMedios(projetoId);
    const totalAtorComplexo = await this.getTotalAtoresComplexos(projetoId);
    const somaAtores =
      totalAtorSimples + totalAtorMedio * 2 + totalAtorComplexo * 3;

    const pesoPontos = somaCasos + somaAtores;

    return {
      casosPeso: somaCasos,
      atoresPeso: somaAtores,
      total: pesoPontos,
    };
  }
}
