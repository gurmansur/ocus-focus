import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { Ator } from '../ator/entities/ator.entity';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { FatorAmbientalProjeto } from '../fator-ambiental-projeto/entities/fator-ambiental-projeto.entity';
import { FatorTecnicoProjeto } from '../fator-tecnico-projeto/entities/fator-tecnico-projeto.entity';
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
    @InjectRepository(FatorAmbientalProjeto)
    private readonly fatorAmbientalRepository: Repository<FatorAmbientalProjeto>,
    @InjectRepository(FatorTecnicoProjeto)
    private readonly fatorTecnicoRepository: Repository<FatorTecnicoProjeto>,
    @Inject('ILogger') private logger: ILogger,
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
      const Tfactor = await this.calcularTFactor(projetoId);
      const Efactor = await this.calcularEFactor(projetoId);

      const totalCasoSimples = await this.getTotalCasosSimples(projetoId);
      const totalCasoMedio = await this.getTotalCasosMedios(projetoId);
      const totalCasoComplexo = await this.getTotalCasosComplexos(projetoId);

      const casoUsoGeral =
        totalCasoSimples * 5 + totalCasoMedio * 10 + totalCasoComplexo * 15;

      const totalAtorSimples = await this.getTotalAtoresSimples(projetoId);
      const totalAtorMedio = await this.getTotalAtoresMedios(projetoId);
      const totalAtorComplexo = await this.getTotalAtoresComplexos(projetoId);

      const atoresGeral =
        totalAtorSimples + totalAtorMedio * 2 + totalAtorComplexo * 3;

      const pontosGerais = casoUsoGeral + atoresGeral;

      const pontosCasoUso = pontosGerais * Tfactor * Efactor;

      const estimativaHoras = pontosCasoUso * 20;

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
        pesoAtores: atoresGeral,
        pesoCasosUso: casoUsoGeral,
        pesoPontosCasosUso: pontosGerais,
        resultadoPontosCasosUso: pontosCasoUso,
        resultadoHoras: estimativaHoras,
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

  private async calcularEFactor(projetoId: number): Promise<number> {
    const fatores = await this.fatorAmbientalRepository.find({
      where: { projeto: { id: projetoId } },
      relations: ['fatorAmbiental'],
    });

    const soma = fatores.reduce((total, fatorProj) => {
      return total + fatorProj.valor * fatorProj.fatorAmbiental.peso;
    }, 0);

    const Efactor = 1.4 + soma * -0.03;
    return parseFloat(Efactor.toFixed(3));
  }

  private async calcularTFactor(projetoId: number): Promise<number> {
    const fatores = await this.fatorTecnicoRepository.find({
      where: { projeto: { id: projetoId } },
      relations: ['fatorTecnico'],
    });

    const soma = fatores.reduce((total, fatorProj) => {
      return total + fatorProj.valor * fatorProj.fatorTecnico.peso;
    }, 0);

    const Tfactor = 0.6 + soma / 100;
    return parseFloat(Tfactor.toFixed(3));
  }
}
