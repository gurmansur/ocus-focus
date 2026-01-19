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
    });

    return {
      items: priorizacoes.map((priorizacao) => {
        return {
          id: priorizacao.id,
          classificacaoRequisito: priorizacao.classificacaoRequisito,
          respostaPositiva: priorizacao.respostaPositiva,
          respostaNegativa: priorizacao.respostaNegativa,
          stakeholder: {
            id: priorizacao.stakeholder.id,
            nome: priorizacao.stakeholder.nome,
          },
        };
      }),
    };
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
