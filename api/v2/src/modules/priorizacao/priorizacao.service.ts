import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { RequisitoService } from '../requisito/requisito-funcional.service';
import { ResultadoRequisitoService } from '../resultado-requisito/resultado-requisito.service';
import { StatusPriorizacaoService } from '../status-priorizacao/status-priorizacao.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreatePriorizacaoDto } from './dto/create-priorizacao.dto';
import { Priorizacao } from './entities/priorizacao.entity';

@Injectable()
export class PriorizacaoService {
  constructor(
    @InjectRepository(Priorizacao)
    private priorizacaoRepository: Repository<Priorizacao>,
    @Inject() private readonly resultadoService: ResultadoRequisitoService,
    @Inject() private readonly usuarioService: UsuarioService,
    @Inject()
    private readonly statusPriorizacaoService: StatusPriorizacaoService,
    @Inject() private readonly requisitoService: RequisitoService,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async createPriorizacao(
    createPriorizacaoDto: CreatePriorizacaoDto,
    usuarioId: number,
  ) {
    const priorizacao = this.priorizacaoRepository.create(createPriorizacaoDto);

    const usuario = await this.usuarioService.findOne(usuarioId);

    priorizacao.usuario = usuario;

    const requisito = await this.requisitoService.getById(
      createPriorizacaoDto.requisito,
    );

    priorizacao.requisitoFuncional = requisito;

    return this.priorizacaoRepository.save(priorizacao);
  }

  createResultado(
    requisito: number,
    resultadoFinal:
      | 'DEVE SER FEITO'
      | 'PERFORMANCE'
      | 'ATRATIVO'
      | 'INDIFERENTE'
      | 'QUESTIONAVEL'
      | 'REVERSO',
  ) {
    return this.resultadoService.create(requisito, resultadoFinal);
  }

  async findByProjeto(projetoId: number) {
    const priorizacoes = await this.priorizacaoRepository.find({
      where: {
        requisitoFuncional: { projeto: { id: projetoId } },
      },
      relations: ['usuario', 'requisitoFuncional'],
    });

    // Group responses by requirement
    const groupedByRequirement = priorizacoes.reduce(
      (acc, priorizacao) => {
        const reqId = priorizacao.requisitoFuncional.id;
        if (!acc[reqId]) {
          acc[reqId] = [];
        }
        acc[reqId].push(priorizacao);
        return acc;
      },
      {} as Record<number, Priorizacao[]>,
    );

    // Transform to frontend expected format
    const items = Object.entries(groupedByRequirement).map(
      ([requirementId, responses]) => {
        const mappedResponses = responses.map((priorizacao) => ({
          id: priorizacao.id,
          requirementId: String(requirementId),
          stakeholderId: String(priorizacao.usuario.id),
          stakeholderName: priorizacao.usuario.nome,
          // Map backend enum values to frontend answers (1-5)
          functionalAnswer: this.mapBackendAnswerToFrontend(
            priorizacao.respostaPositiva,
          ),
          dysfunctionalAnswer: this.mapBackendAnswerToFrontend(
            priorizacao.respostaNegativa,
          ),
          // Map backend classification to frontend category
          category: this.mapBackendCategoryToFrontend(
            priorizacao.classificacaoRequisito,
          ),
          answeredAt: new Date(),
        }));

        // Count categories
        const categoryCounts = mappedResponses.reduce(
          (counts, response) => {
            counts[response.category] = (counts[response.category] || 0) + 1;
            return counts;
          },
          {
            'must-be': 0,
            'one-dimensional': 0,
            attractive: 0,
            indifferent: 0,
            reverse: 0,
            questionable: 0,
          },
        );

        // Find dominant category
        const dominantCategory = Object.entries(categoryCounts).reduce(
          (max, [category, count]) =>
            count > categoryCounts[max] ? category : max,
          'indifferent',
        ) as any;

        return {
          requirementId: String(requirementId),
          responses: mappedResponses,
          categoryCounts,
          dominantCategory,
        };
      },
    );

    return items;
  }

  private mapBackendAnswerToFrontend(
    answer:
      | 'GOSTARIA'
      | 'ESPERADO'
      | 'NAO IMPORTA'
      | 'CONVIVO COM ISSO'
      | 'NAO GOSTARIA',
  ): 1 | 2 | 3 | 4 | 5 {
    const mapping = {
      GOSTARIA: 1,
      ESPERADO: 2,
      'NAO IMPORTA': 3,
      'CONVIVO COM ISSO': 4,
      'NAO GOSTARIA': 5,
    };
    return mapping[answer] as 1 | 2 | 3 | 4 | 5;
  }

  private mapBackendCategoryToFrontend(
    category:
      | 'DEVE SER FEITO'
      | 'PERFORMANCE'
      | 'ATRATIVO'
      | 'INDIFERENTE'
      | 'QUESTIONAVEL'
      | 'REVERSO',
  ):
    | 'must-be'
    | 'one-dimensional'
    | 'attractive'
    | 'indifferent'
    | 'reverse'
    | 'questionable' {
    const mapping = {
      'DEVE SER FEITO': 'must-be',
      PERFORMANCE: 'one-dimensional',
      ATRATIVO: 'attractive',
      INDIFERENTE: 'indifferent',
      QUESTIONAVEL: 'questionable',
      REVERSO: 'reverse',
    };
    return mapping[category] as any;
  }

  update(stakeholderId: number) {
    return this.statusPriorizacaoService.updateParticipation(stakeholderId);
  }

  async getMostFrequentClassification(requisitoId: number) {
    const mostFrequent = await this.priorizacaoRepository
      .createQueryBuilder('priorizacao')
      .select(
        'priorizacao.classificacaoRequisito',
        'PRS_CLASSIFICACAO_REQUISITO',
      )
      .addSelect('COUNT(priorizacao.classificacaoRequisito)', 'count')
      .where('priorizacao.requisitoFuncional.id = :requisitoId', {
        requisitoId,
      })
      .groupBy('priorizacao.classificacaoRequisito')
      .orderBy('count', 'DESC')
      .getRawOne();

    return [mostFrequent];
  }
}
