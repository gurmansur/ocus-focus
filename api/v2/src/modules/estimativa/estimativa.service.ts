import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { Ator } from '../ator/entities/ator.entity';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { FatorAmbientalProjeto } from '../fator-ambiental-projeto/entities/fator-ambiental-projeto.entity';
import { FatorTecnicoProjeto } from '../fator-tecnico-projeto/entities/fator-tecnico-projeto.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ProjetoService } from '../projeto/projeto.service';
import { CreateEstimativaSessionDto } from './dto/create-estimativa-session.dto';
import {
  ActorWeightDto,
  EnvironmentalFactorDto,
  EstimativaSessionDto,
  SessionStatus,
  TechnicalFactorDto,
  UseCaseWeightDto,
} from './dto/estimativa-session.dto';
import { UpdateEstimativaSessionDto } from './dto/update-estimativa-session.dto';
import { Estimativa } from './entities/estimativa.entity';

// UCP calculation constants and helpers
const TECHNICAL_FACTOR_WEIGHTS: Record<string, number> = {
  T1: 2,
  T2: 1,
  T3: 1,
  T4: 1,
  T5: 1,
  T6: 0.5,
  T7: 0.5,
  T8: 2,
  T9: 1,
  T10: 1,
  T11: 1,
  T12: 1,
  T13: 1,
};

const ENVIRONMENTAL_FACTOR_WEIGHTS: Record<string, number> = {
  E1: 1.5,
  E2: 0.5,
  E3: 1,
  E4: 0.5,
  E5: 1,
  E6: 2,
  E7: -1,
  E8: -1,
};

function createDefaultTechnicalFactors(): TechnicalFactorDto[] {
  return Object.keys(TECHNICAL_FACTOR_WEIGHTS).map((id) => ({
    id,
    rating: 0,
  }));
}

function createDefaultEnvironmentalFactors(): EnvironmentalFactorDto[] {
  return Object.keys(ENVIRONMENTAL_FACTOR_WEIGHTS).map((id) => ({
    id,
    rating: 0,
  }));
}

function calculateTFactor(factors: TechnicalFactorDto[]): number {
  const sum = factors.reduce(
    (total, f) => total + f.rating * TECHNICAL_FACTOR_WEIGHTS[f.id],
    0,
  );
  return sum;
}

function calculateTCF(tfactor: number): number {
  return 0.6 + tfactor / 100;
}

function calculateEFactor(factors: EnvironmentalFactorDto[]): number {
  const sum = factors.reduce(
    (total, f) => total + f.rating * ENVIRONMENTAL_FACTOR_WEIGHTS[f.id],
    0,
  );
  return sum;
}

function calculateEF(efactor: number): number {
  return 1.4 + efactor * -0.03;
}

function calculateUCP(uucp: number, tcf: number, ef: number): number {
  return uucp * tcf * ef;
}

function safeJsonParse<T>(
  json: string | null | undefined | any,
  defaultValue: T,
): T {
  // If it's already an object/array, return it directly (TypeORM auto-deserializes JSON columns)
  if (json && typeof json === 'object') {
    return json as T;
  }

  // If it's not a string or is empty, return default
  if (!json || typeof json !== 'string' || json.trim() === '') {
    return defaultValue;
  }

  try {
    return JSON.parse(json);
  } catch (error) {
    console.warn('Failed to parse JSON:', json, error);
    return defaultValue;
  }
}

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
      relations: ['createdBy', 'projeto'],
      take,
      skip,
      order: { updatedAt: 'DESC' },
    });

    return {
      items: items.map((item) => this.mapToDto(item)),
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  async findOne(id: number, projetoId: number): Promise<EstimativaSessionDto> {
    const estimativa = await this.estimativaRepository.findOne({
      where: { id, projeto: { id: projetoId } },
      relations: ['createdBy', 'projeto'],
    });

    if (!estimativa) {
      throw new NotFoundException(`Estimation session with ID ${id} not found`);
    }

    return this.mapToDto(estimativa);
  }

  async createSession(
    dto: CreateEstimativaSessionDto,
    projeto: Projeto,
    colaborador: Colaborador,
  ): Promise<EstimativaSessionDto> {
    const estimativa = this.estimativaRepository.create({
      name: dto.name,
      description: dto.description,
      projeto,
      createdBy: colaborador,
      // TypeORM auto-serializes JSON columns, pass objects directly
      useCaseWeights: [] as any,
      actorWeights: [] as any,
      technicalFactors: createDefaultTechnicalFactors() as any,
      environmentalFactors: createDefaultEnvironmentalFactors() as any,
      uucw: 0,
      uaw: 0,
      uucp: 0,
      tfactor: 0,
      tcf: 0.6,
      efactor: 0,
      ef: 1.4,
      ucp: 0,
      hoursPerUCP: 20,
      estimatedHours: 0,
      estimatedDays: 0,
      status: SessionStatus.DRAFT,
    });

    const saved = await this.estimativaRepository.save(estimativa);
    return this.mapToDto(saved);
  }

  async updateSession(
    id: number,
    dto: UpdateEstimativaSessionDto,
    projetoId: number,
  ): Promise<EstimativaSessionDto> {
    const estimativa = await this.estimativaRepository.findOne({
      where: { id, projeto: { id: projetoId } },
      relations: ['createdBy', 'projeto'],
    });

    if (!estimativa) {
      throw new NotFoundException(`Estimation session with ID ${id} not found`);
    }

    // Update basic fields
    if (dto.name !== undefined) estimativa.name = dto.name;
    if (dto.description !== undefined) estimativa.description = dto.description;
    if (dto.status !== undefined) estimativa.status = dto.status;
    if (dto.hoursPerUCP !== undefined) estimativa.hoursPerUCP = dto.hoursPerUCP;

    // Update complex fields - TypeORM auto-serializes JSON columns, don't stringify
    if (dto.useCaseWeights !== undefined) {
      estimativa.useCaseWeights = dto.useCaseWeights as any;
    }
    if (dto.actorWeights !== undefined) {
      estimativa.actorWeights = dto.actorWeights as any;
    }
    if (dto.technicalFactors !== undefined) {
      estimativa.technicalFactors = dto.technicalFactors as any;
    }
    if (dto.environmentalFactors !== undefined) {
      estimativa.environmentalFactors = dto.environmentalFactors as any;
    }

    // Recalculate UCP values
    this.recalculateSession(estimativa);

    const saved = await this.estimativaRepository.save(estimativa);
    return this.mapToDto(saved);
  }

  async removeSession(id: number, projetoId: number): Promise<void> {
    const estimativa = await this.estimativaRepository.findOne({
      where: { id, projeto: { id: projetoId } },
    });

    if (!estimativa) {
      throw new NotFoundException(`Estimation session with ID ${id} not found`);
    }

    await this.estimativaRepository.remove(estimativa);
  }

  private recalculateSession(estimativa: Estimativa): void {
    const useCaseWeights: UseCaseWeightDto[] = safeJsonParse(
      estimativa.useCaseWeights,
      [],
    );
    const actorWeights: ActorWeightDto[] = safeJsonParse(
      estimativa.actorWeights,
      [],
    );
    const technicalFactors: TechnicalFactorDto[] = safeJsonParse(
      estimativa.technicalFactors,
      createDefaultTechnicalFactors(),
    );
    const environmentalFactors: EnvironmentalFactorDto[] = safeJsonParse(
      estimativa.environmentalFactors,
      createDefaultEnvironmentalFactors(),
    );

    // Calculate UUCW (Unadjusted Use Case Weight)
    const uucw = useCaseWeights.reduce((sum, uc) => sum + uc.weight, 0);

    // Calculate UAW (Unadjusted Actor Weight)
    const uaw = actorWeights.reduce((sum, a) => sum + a.weight, 0);

    // Calculate UUCP (Unadjusted Use Case Points)
    const uucp = uucw + uaw;

    // Calculate TCF (Technical Complexity Factor)
    const tfactor = calculateTFactor(technicalFactors);
    const tcf = calculateTCF(tfactor);

    // Calculate EF (Environmental Factor)
    const efactor = calculateEFactor(environmentalFactors);
    const ef = calculateEF(efactor);

    // Calculate UCP (Use Case Points)
    const ucp = calculateUCP(uucp, tcf, ef);

    // Calculate estimated hours and days
    const estimatedHours = ucp * estimativa.hoursPerUCP;
    const estimatedDays = estimatedHours / 8;

    // Update estimativa
    estimativa.uucw = uucw;
    estimativa.uaw = uaw;
    estimativa.uucp = uucp;
    estimativa.tfactor = tfactor;
    estimativa.tcf = tcf;
    estimativa.efactor = efactor;
    estimativa.ef = ef;
    estimativa.ucp = ucp;
    estimativa.estimatedHours = estimatedHours;
    estimativa.estimatedDays = estimatedDays;

    // Update legacy fields for backward compatibility
    estimativa.resultadoHoras = estimatedHours;
    estimativa.pesoPontosCasosUso = uucp;
    estimativa.resultadoPontosCasosUso = ucp;
    estimativa.pesoAtores = uaw;
    estimativa.pesoCasosUso = uucw;
    estimativa.tFactor = tfactor;
    estimativa.eFactor = efactor;
  }

  private mapToDto(estimativa: Estimativa): EstimativaSessionDto {
    const technicalFactors = safeJsonParse(
      estimativa.technicalFactors,
      createDefaultTechnicalFactors(),
    );
    const environmentalFactors = safeJsonParse(
      estimativa.environmentalFactors,
      createDefaultEnvironmentalFactors(),
    );

    return {
      id: estimativa.id,
      name: estimativa.name || 'Unnamed Session',
      description: estimativa.description || '',
      projectId: estimativa.projeto.id,
      useCaseWeights: safeJsonParse(estimativa.useCaseWeights, []),
      actorWeights: safeJsonParse(estimativa.actorWeights, []),
      technicalFactors,
      environmentalFactors,
      uucw: estimativa.uucw || 0,
      uaw: estimativa.uaw || 0,
      uucp: estimativa.uucp || 0,
      tfactor: estimativa.tfactor || 0,
      tcf: estimativa.tcf || 0.6,
      efactor: estimativa.efactor || 0,
      ef: estimativa.ef || 1.4,
      ucp: estimativa.ucp || 0,
      hoursPerUCP: estimativa.hoursPerUCP || 20,
      estimatedHours: estimativa.estimatedHours || 0,
      estimatedDays: estimativa.estimatedDays || 0,
      status: (estimativa.status as SessionStatus) || SessionStatus.DRAFT,
      createdAt: estimativa.createdAt || new Date(),
      updatedAt: estimativa.updatedAt || new Date(),
      createdBy: estimativa.createdBy?.id || 0,
    };
  }

  // Legacy method for backward compatibility
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
