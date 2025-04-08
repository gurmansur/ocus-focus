import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CasoDeTesteService } from '../caso-de-teste/caso-de-teste.service';
import { Projeto } from '../projeto/entities/projeto.entity';
import { SuiteDeTesteDto } from '../suite-de-teste/dto/suite-de-teste.dto';
import { SuiteDeTesteService } from '../suite-de-teste/suite-de-teste.service';
import { ChangeStatusExecucaoDeTesteBo } from './bo/change-status-execucao-de-teste.bo';
import { CreateExecucaoDeTesteBo } from './bo/create-execucao-de-teste.bo';
import { GetExecucaoDeTesteGraficoQueryBo } from './bo/get-execucao-de-teste-grafico-query.bo';
import { UpdateExecucaoDeTesteBo } from './bo/update-execucao-de-teste.bo';
import { ExecucaoDeTeste } from './entities/execucao-de-teste.entity';
import { ExecucaoDeTesteMapper } from './execucao-de-teste.mapper';
import { ExecucaoDeTesteRepository } from './repositories/execucao-de-teste.repository';

@Injectable()
export class ExecucaoDeTesteService {
  constructor(
    @InjectRepository(ExecucaoDeTeste)
    private execucaoDeTesteRepository: Repository<ExecucaoDeTeste>,
    private casoDeTesteService: CasoDeTesteService,
    private suiteDeTesteService: SuiteDeTesteService,
    private execucaoDeTesteCustomRepository: ExecucaoDeTesteRepository,
  ) {}

  async create(createExecucaoDeTesteBo: CreateExecucaoDeTesteBo, projetoId: number) {
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
      
      entity.casoDeTeste = { id: createExecucaoDeTesteBo.casoDeTesteId } as any;
    }

    return ExecucaoDeTesteMapper.entityToBo(
      await this.execucaoDeTesteRepository.save(entity),
    );
  }

  async findAll(projetoId: number, page: number = 0, pageSize: number = 10) {
    return this.execucaoDeTesteCustomRepository.findAllPaginated(projetoId, page, pageSize);
  }

  async findByNome(nome: string, projetoId: number, page: number = 0, pageSize: number = 10) {
    return this.execucaoDeTesteCustomRepository.findByNome(nome, projetoId, page, pageSize);
  }

  async findByCasoDeTeste(casoDeTesteId: number, page: number = 0, pageSize: number = 10) {
    return this.execucaoDeTesteCustomRepository.findByCasoDeTeste(casoDeTesteId, page, pageSize);
  }

  async findOne(id: number) {
    const entity = await this.execucaoDeTesteRepository.findOne({ 
      where: { id },
      relations: [
        'casoDeTeste',
        'casoDeTeste.projeto',
        'casoDeTeste.testadorDesignado',
      ],
    });
    
    if (!entity) {
      throw new BadRequestException('Execução de teste não encontrada');
    }
    
    return ExecucaoDeTesteMapper.entityToBo(entity);
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

    if (!entity) {
      throw new BadRequestException('Execução de teste não encontrada');
    }

    const updatedEntity = ExecucaoDeTesteMapper.changeStatusBoToEntity(
      changeStatusExecucaoDeTesteBo,
    );

    Object.assign(entity, updatedEntity);

    return this.execucaoDeTesteRepository.save(entity);
  }

  remove(id: number) {
    return this.execucaoDeTesteRepository.softDelete(id);
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
}
