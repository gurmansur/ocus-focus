import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { SuiteDeTesteService } from '../suite-de-teste/suite-de-teste.service';
import { CreateCasoDeTesteBo } from './bo/create-caso-de-teste.bo';
import { UpdateCasoDeTesteBo } from './bo/update-caso-de-teste.bo';
import { CasoDeTesteMapper } from './caso-de-teste.mapper';
import { CasoDeTeste } from './entities/caso-de-teste.entity';
import { CasoDeTesteRepository } from './repositories/caso-de-teste.repository';

@Injectable()
export class CasoDeTesteService {
  constructor(
    @InjectRepository(CasoDeTeste)
    private casoDeTesteRepository: Repository<CasoDeTeste>,
    @Inject(forwardRef(() => SuiteDeTesteService))
    private suiteDeTesteService: SuiteDeTesteService,
    private casoDeTesteCustomRepository: CasoDeTesteRepository,
  ) {}

  async create(createCasoDeTesteBo: CreateCasoDeTesteBo, projetoId: number) {
    const entity =
      CasoDeTesteMapper.createCasoDeTesteBoToEntity(createCasoDeTesteBo);

    if (createCasoDeTesteBo.suiteDeTesteId) {
      const suiteDeTeste = await this.suiteDeTesteService.findOne(
        createCasoDeTesteBo.suiteDeTesteId,
      );

      if (!suiteDeTeste) {
        throw new BadRequestException('Suite de teste não encontrada');
      }

      entity.suiteDeTeste = { id: createCasoDeTesteBo.suiteDeTesteId } as any;
    }

    entity.projeto = { id: projetoId } as Projeto;

    return CasoDeTesteMapper.entityToCasoDeTesteBo(
      await this.casoDeTesteRepository.save(entity),
    );
  }

  async findAll(projetoId: number, page: number = 0, pageSize: number = 10) {
    return this.casoDeTesteCustomRepository.findAllPaginated(
      projetoId,
      page,
      pageSize,
    );
  }

  async findAllWithoutSuite(projetoId: number) {
    return (
      await this.casoDeTesteRepository.find({
        relations: ['testadorDesignado', 'suiteDeTeste', 'casoDeUso'],
        where: {
          suiteDeTeste: IsNull(),
          projeto: { id: projetoId },
        },
      })
    ).map((casoDeTeste) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(casoDeTeste),
    );
  }

  async findOne(id: number) {
    const casoDeTeste = await this.casoDeTesteRepository.findOne({
      where: { id },
      relations: ['testadorDesignado', 'suiteDeTeste', 'casoDeUso'],
    });

    if (!casoDeTeste) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    return CasoDeTesteMapper.entityToCasoDeTesteBo(casoDeTeste);
  }

  async findByNome(
    nome: string,
    projetoId: number,
    page: number = 0,
    pageSize: number = 10,
  ) {
    return this.casoDeTesteCustomRepository.findByNome(
      nome,
      projetoId,
      page,
      pageSize,
    );
  }

  async findBySuiteDeTeste(
    suiteDeTesteId: number,
    page: number = 0,
    pageSize: number = 10,
  ) {
    return this.casoDeTesteCustomRepository.findBySuiteDeTeste(
      suiteDeTesteId,
      page,
      pageSize,
    );
  }

  async update(
    id: number,
    updateCasoDeTesteBo: UpdateCasoDeTesteBo,
    projetoId: number,
  ) {
    const caso = await this.casoDeTesteRepository.findOne({
      where: { id },
      relations: ['suiteDeTeste', 'projeto'],
    });

    if (!caso) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    const entity =
      CasoDeTesteMapper.updateCasoDeTesteBoToEntity(updateCasoDeTesteBo);

    entity.suiteDeTeste = caso.suiteDeTeste;
    entity.projeto = { id: projetoId } as Projeto;

    return this.casoDeTesteRepository.update(id, entity);
  }

  changeSuite(id: number, suiteId: number) {
    const suite = this.suiteDeTesteService.findOne(suiteId);

    if (suiteId && !suite) {
      throw new BadRequestException('Suite de teste não encontrada');
    }

    return this.casoDeTesteRepository.update(id, {
      suiteDeTeste: { id: suiteId },
    });
  }

  remove(id: number) {
    return this.casoDeTesteRepository.softDelete(id);
  }
}
