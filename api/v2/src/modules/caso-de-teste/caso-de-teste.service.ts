import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { Projeto } from '../projeto/entities/projeto.entity';
import { SuiteDeTesteService } from '../suite-de-teste/suite-de-teste.service';
import { CreateCasoDeTesteBo } from './bo/create-caso-de-teste.bo';
import { UpdateCasoDeTesteBo } from './bo/update-caso-de-teste.bo';
import { CasoDeTesteMapper } from './caso-de-teste.mapper';
import { CasoDeTeste } from './entities/caso-de-teste.entity';

@Injectable()
export class CasoDeTesteService {
  constructor(
    @InjectRepository(CasoDeTeste)
    private casoDeTesteRepository: Repository<CasoDeTeste>,
    @Inject(forwardRef(() => SuiteDeTesteService))
    private suiteDeTesteService: SuiteDeTesteService,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async create(createCasoDeTesteBo: CreateCasoDeTesteBo, projeto: Projeto) {
    this.logger.log(`Creating test case for projeto ${projeto.id}`);
    const entity =
      CasoDeTesteMapper.createCasoDeTesteBoToEntity(createCasoDeTesteBo);

    if (createCasoDeTesteBo.suiteDeTesteId) {
      entity.suiteDeTeste = await this.suiteDeTesteService.findOne(
        createCasoDeTesteBo.suiteDeTesteId,
      );

      if (!entity.suiteDeTeste) {
        throw new BadRequestException('Suite de teste não encontrada');
      }
    }

    entity.projeto = projeto;

    return CasoDeTesteMapper.entityToCasoDeTesteBo(
      await this.casoDeTesteRepository.save(entity),
    );
  }

  async findAll(projeto: Projeto) {
    const casosDeTeste = await this.casoDeTesteRepository
      .createQueryBuilder('caso')
      .leftJoinAndSelect('caso.testadorDesignado', 'testador')
      .leftJoinAndSelect('caso.suiteDeTeste', 'suite')
      .leftJoinAndSelect('caso.casoDeUso', 'casoUso')
      .leftJoinAndSelect('caso.projeto', 'projeto')
      .leftJoinAndSelect('caso.execucoesDeTeste', 'execucoes')
      .where('caso.projeto.id = :projetoId', { projetoId: projeto.id })
      .orderBy('execucoes.dataExecucao', 'DESC')
      .getMany();

    // Sort executions manually to ensure the most recent is first
    casosDeTeste.forEach((caso) => {
      if (caso.execucoesDeTeste && caso.execucoesDeTeste.length > 1) {
        caso.execucoesDeTeste.sort(
          (a, b) =>
            new Date(b.dataExecucao).getTime() -
            new Date(a.dataExecucao).getTime(),
        );
      }
    });

    return casosDeTeste.map((casoDeTeste) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(casoDeTeste),
    );
  }

  async findAllWithoutSuite(projeto: Projeto) {
    const casosDeTeste = await this.casoDeTesteRepository
      .createQueryBuilder('caso')
      .leftJoinAndSelect('caso.testadorDesignado', 'testador')
      .leftJoinAndSelect('caso.suiteDeTeste', 'suite')
      .leftJoinAndSelect('caso.casoDeUso', 'casoUso')
      .leftJoinAndSelect('caso.execucoesDeTeste', 'execucoes')
      .where('caso.suiteDeTeste IS NULL')
      .andWhere('caso.projeto.id = :projetoId', { projetoId: projeto.id })
      .getMany();

    // Sort executions manually to ensure the most recent is first
    casosDeTeste.forEach((caso) => {
      if (caso.execucoesDeTeste && caso.execucoesDeTeste.length > 1) {
        caso.execucoesDeTeste.sort(
          (a, b) =>
            new Date(b.dataExecucao).getTime() -
            new Date(a.dataExecucao).getTime(),
        );
      }
    });

    return casosDeTeste.map((casoDeTeste) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(casoDeTeste),
    );
  }

  async findOne(id: number, projeto?: Projeto) {
    const casoDeTeste = await this.casoDeTesteRepository
      .createQueryBuilder('caso')
      .leftJoinAndSelect('caso.testadorDesignado', 'testador')
      .leftJoinAndSelect('caso.suiteDeTeste', 'suite')
      .leftJoinAndSelect('caso.casoDeUso', 'casoUso')
      .leftJoinAndSelect('caso.execucoesDeTeste', 'execucoes')
      .leftJoinAndSelect('caso.projeto', 'projeto')
      .where('caso.id = :id', { id })
      .getOne();

    if (!casoDeTeste) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    // Verify project ownership if provided
    if (projeto && casoDeTeste.projeto?.id !== projeto.id) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    // Sort executions manually to ensure the most recent is first
    if (
      casoDeTeste.execucoesDeTeste &&
      casoDeTeste.execucoesDeTeste.length > 1
    ) {
      casoDeTeste.execucoesDeTeste.sort(
        (a, b) =>
          new Date(b.dataExecucao).getTime() -
          new Date(a.dataExecucao).getTime(),
      );
    }

    return CasoDeTesteMapper.entityToCasoDeTesteBo(casoDeTeste);
  }

  async update(
    id: number,
    updateCasoDeTesteBo: UpdateCasoDeTesteBo,
    projeto?: Projeto,
  ) {
    const caso = await this.casoDeTesteRepository.findOne({
      where: { id },
      relations: ['projeto', 'suiteDeTeste'],
    });

    if (!caso) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    // Verify project ownership if provided
    if (projeto && caso.projeto?.id !== projeto.id) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    const entity =
      CasoDeTesteMapper.updateCasoDeTesteBoToEntity(updateCasoDeTesteBo);

    entity.suiteDeTeste = caso.suiteDeTeste;

    return this.casoDeTesteRepository.update(id, entity);
  }

  async changeSuite(id: number, suiteId: number | null, projeto?: Projeto) {
    const caso = await this.casoDeTesteRepository.findOne({
      where: { id },
      relations: ['projeto'],
    });

    if (!caso) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    // Verify project ownership if provided
    if (projeto && caso.projeto?.id !== projeto.id) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    // If suiteId is provided, validate it exists
    if (suiteId !== null) {
      const suite = await this.suiteDeTesteService.findOne(suiteId, projeto);
      if (!suite) {
        throw new BadRequestException('Suite de teste não encontrada');
      }
    }

    // Update the test case's suite (null to unassign from all suites)
    return this.casoDeTesteRepository.update(id, {
      suiteDeTeste: suiteId ? { id: suiteId } : null,
    });
  }

  async remove(id: number, projeto?: Projeto) {
    const caso = await this.casoDeTesteRepository.findOne({
      where: { id },
      relations: ['projeto'],
    });

    if (!caso) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    // Verify project ownership if provided
    if (projeto && caso.projeto?.id !== projeto.id) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    return this.casoDeTesteRepository.softDelete(id);
  }

  async findByCasoUsoId(casoUsoId: number, projeto: Projeto) {
    return (
      await this.casoDeTesteRepository.find({
        relations: [
          'testadorDesignado',
          'suiteDeTeste',
          'casoDeUso',
          'projeto',
        ],
        where: { casoDeUso: { id: casoUsoId }, projeto: { id: projeto.id } },
      })
    ).map((casoDeTeste) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(casoDeTeste),
    );
  }
}
