import { BadRequestException, Injectable, MessageEvent } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { In, Repository } from 'typeorm';
import { AcaoDeTesteService } from '../acao-de-teste/acao-de-teste.service';
import { CasoDeTesteService } from '../caso-de-teste/caso-de-teste.service';
import { ConfiguracaoSeleniumService } from '../configuracao-selenium/configuracao-selenium.service';
import { ExecutorSeleniumService } from '../executor-selenium/executor-selenium.service';
import { Projeto } from '../projeto/entities/projeto.entity';
import { SuiteDeTesteDto } from '../suite-de-teste/dto/suite-de-teste.dto';
import { SuiteDeTesteService } from '../suite-de-teste/suite-de-teste.service';
import { ChangeStatusExecucaoDeTesteBo } from './bo/change-status-execucao-de-teste.bo';
import { CreateExecucaoDeTesteBo } from './bo/create-execucao-de-teste.bo';
import { GetExecucaoDeTesteGraficoQueryBo } from './bo/get-execucao-de-teste-grafico-query.bo';
import { UpdateExecucaoDeTesteBo } from './bo/update-execucao-de-teste.bo';
import { ExecucaoDeTeste } from './entities/execucao-de-teste.entity';
import { EXECUTION_TYPES, RESULT_TYPES } from './execucao-de-teste.constants';
import { ExecucaoDeTesteMapper } from './execucao-de-teste.mapper';

@Injectable()
export class ExecucaoDeTesteService {
  constructor(
    @InjectRepository(ExecucaoDeTeste)
    private execucaoDeTesteRepository: Repository<ExecucaoDeTeste>,
    private casoDeTesteService: CasoDeTesteService,
    private suiteDeTesteService: SuiteDeTesteService,
    private acaoDeTesteService: AcaoDeTesteService,
    private configuracaoSeleniumService: ConfiguracaoSeleniumService,
    private executorSeleniumService: ExecutorSeleniumService,
  ) {}

  async create(createExecucaoDeTesteBo: CreateExecucaoDeTesteBo) {
    const entity = ExecucaoDeTesteMapper.createBoToEntity(
      createExecucaoDeTesteBo,
    );

    if (createExecucaoDeTesteBo.casoDeTesteId) {
      const caso = await this.casoDeTesteService.findOne(
        createExecucaoDeTesteBo.casoDeTesteId,
      );

      if (!caso) {
        throw new BadRequestException('Caso de teste não encontrado');
      }
    }

    return ExecucaoDeTesteMapper.entityToBo(
      await this.execucaoDeTesteRepository.save(entity),
    );
  }

  async findAll(projeto: Projeto) {
    const entities = await this.execucaoDeTesteRepository.find({
      relations: [
        'casoDeTeste',
        'casoDeTeste.projeto',
        'casoDeTeste.testadorDesignado',
      ],
      where: { casoDeTeste: { projeto } },
    });

    return entities.map((entity) => ExecucaoDeTesteMapper.entityToBo(entity));
  }

  async findOne(id: number) {
    return ExecucaoDeTesteMapper.entityToBo(
      await this.execucaoDeTesteRepository.findOne({ where: { id } }),
    );
  }

  update(id: number, updateExecucaoDeTesteBo: UpdateExecucaoDeTesteBo) {
    const entity = ExecucaoDeTesteMapper.updateBoToEntity(
      updateExecucaoDeTesteBo,
    );

    return this.execucaoDeTesteRepository.update(id, entity);
  }

  async changeStatus(
    id: number,
    changeStatusExecucaoDeTesteBo: ChangeStatusExecucaoDeTesteBo,
  ) {
    const entity = await this.execucaoDeTesteRepository.findOne({
      where: { id },
    });

    const updatedEntity = ExecucaoDeTesteMapper.changeStatusBoToEntity(
      changeStatusExecucaoDeTesteBo,
    );

    Object.assign(entity, updatedEntity);

    return this.execucaoDeTesteRepository.save(entity);
  }

  remove(id: number) {
    return this.execucaoDeTesteRepository.softDelete(id);
  }

  async executarTesteAutomatizado(
    casoDeTesteId: number,
    projeto: Projeto,
  ): Promise<any> {
    // Buscar as ações do caso de teste
    const acoes =
      await this.acaoDeTesteService.findByCasoDeTesteId(casoDeTesteId);

    if (!acoes || acoes.length === 0) {
      throw new BadRequestException(
        'Caso de teste não possui ações configuradas',
      );
    }

    // Buscar configuração ativa do Selenium
    const configuracao =
      await this.configuracaoSeleniumService.findAtivaPorProjeto(projeto);

    // Criar registro de execução
    const execucaoBo = await this.create({
      nome: `Execução Automatizada`,
      dataExecucao: new Date(),
      metodo: EXECUTION_TYPES.AUTOMATED,
      resultado: RESULT_TYPES.PENDING,
      casoDeTesteId: casoDeTesteId,
    });

    try {
      // Executar o teste com Selenium
      const resultado = await this.executorSeleniumService.executarTeste(
        acoes,
        configuracao,
      );

      // Atualizar status da execução
      await this.changeStatus(execucaoBo.id, {
        resultado: resultado.sucesso
          ? RESULT_TYPES.SUCCESS
          : RESULT_TYPES.FAILURE,
        resposta: resultado.mensagem,
        observacao: resultado.logs.join('\n'),
      });

      return {
        execucaoId: execucaoBo.id,
        ...resultado,
      };
    } catch (error) {
      // Atualizar como falha em caso de erro
      await this.changeStatus(execucaoBo.id, {
        resultado: RESULT_TYPES.FAILURE,
        resposta: error.message,
        observacao: 'Erro durante a execução automatizada',
      });

      throw error;
    }
  }

  async getGrafico(query: GetExecucaoDeTesteGraficoQueryBo, projeto: Projeto) {
    if (query.suiteId) {
      const tree = await this.suiteDeTesteService.getFileTree(
        projeto,
        query.suiteId,
      );

      return this.generateGraficoSuite(tree.suites[0], projeto);
    } else {
      const execucoes = await this.execucaoDeTesteRepository.find({
        where: { casoDeTeste: { projeto } },
        relations: ['casoDeTeste'],
      });

      const resultados = execucoes.reduce((acc, execucao) => {
        if (!acc[execucao.resultado]) {
          acc[execucao.resultado] = 0;
        }

        acc[execucao.resultado]++;

        return acc;
      }, {});

      return resultados;
    }
  }

  async generateGraficoSuite(suite: SuiteDeTesteDto, projeto: Projeto) {
    const casos = suite.casosDeTeste.map((caso) => caso.id);

    const execucoes = await this.execucaoDeTesteRepository.find({
      where: { casoDeTeste: In(casos) },
      relations: ['casoDeTeste'],
    });

    const execucoesFilhas = await Promise.all(
      suite.suitesFilhas?.map((suite) =>
        this.generateGraficoSuite(suite, projeto),
      ) || [],
    );

    const resultados = execucoes.reduce((acc, execucao) => {
      if (!acc[execucao.resultado]) {
        acc[execucao.resultado] = 0;
      }

      acc[execucao.resultado]++;

      return acc;
    }, {});

    execucoesFilhas.forEach((filha) => {
      for (const [key, value] of Object.entries(filha)) {
        if (!resultados[key]) {
          resultados[key] = 0;
        }
        resultados[key] += value;
      }
    });

    return resultados;
  }

  streamExecution(
    casoDeTesteId: number,
    projeto: Projeto,
  ): Observable<MessageEvent> {
    return new Observable((observer) => {
      (async () => {
        try {
          observer.next({
            data: { type: 'start', message: 'Iniciando execução...' },
          } as MessageEvent);

          // Buscar as ações do caso de teste
          const acoes =
            await this.acaoDeTesteService.findByCasoDeTesteId(casoDeTesteId);

          if (!acoes || acoes.length === 0) {
            observer.next({
              data: {
                type: 'error',
                message: 'Caso de teste não possui ações configuradas',
              },
            } as MessageEvent);
            observer.complete();
            return;
          }

          observer.next({
            data: { type: 'log', message: `${acoes.length} ações encontradas` },
          } as MessageEvent);

          // Buscar configuração ativa do Selenium
          const configuracao =
            await this.configuracaoSeleniumService.findAtivaPorProjeto(projeto);
          observer.next({
            data: {
              type: 'log',
              message: `Configuração: ${configuracao?.nome || 'Padrão'}`,
            },
          } as MessageEvent);

          // Criar registro de execução
          const execucaoBo = await this.create({
            nome: `Execução Automatizada`,
            dataExecucao: new Date(),
            metodo: EXECUTION_TYPES.AUTOMATED,
            resultado: RESULT_TYPES.PENDING,
            casoDeTesteId: casoDeTesteId,
          });

          observer.next({
            data: { type: 'log', message: `Execução #${execucaoBo.id} criada` },
          } as MessageEvent);

          // Executar o teste com Selenium, emitindo logs/screenshots em tempo real
          const resultado = await this.executorSeleniumService.executarTeste(
            acoes,
            configuracao,
            (log) =>
              observer.next({
                data: { type: 'log', message: log },
              } as MessageEvent),
            (screenshot) =>
              observer.next({
                data: { type: 'image', src: screenshot },
              } as MessageEvent),
          );

          // Atualizar status da execução
          await this.changeStatus(execucaoBo.id, {
            resultado: resultado.sucesso
              ? RESULT_TYPES.SUCCESS
              : RESULT_TYPES.FAILURE,
            resposta: resultado.mensagem,
            observacao: resultado.logs.join('\n'),
          });

          observer.next({
            data: {
              type: 'complete',
              execucaoId: execucaoBo.id,
              sucesso: resultado.sucesso,
              mensagem: resultado.mensagem,
              screenshots: resultado.screenshots,
            },
          } as MessageEvent);

          observer.complete();
        } catch (error) {
          observer.next({
            data: { type: 'error', message: error.message },
          } as MessageEvent);
          observer.complete();
        }
      })();
    });
  }
}
