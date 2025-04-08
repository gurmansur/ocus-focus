import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Browser, Builder } from 'selenium-webdriver';
import { Like, Repository } from 'typeorm';
import { PaginatedResult } from '../../interfaces/paginated-result.interface';
import { CasoDeTesteService } from '../caso-de-teste/caso-de-teste.service';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ProjetoService } from '../projeto/projeto.service';
import { CreateSuiteDeTesteDto } from './dto/create-suite-de-teste.dto';
import { SuiteDeTesteDto } from './dto/suite-de-teste.dto';
import { UpdateSuiteDeTesteDto } from './dto/update-suite-de-teste.dto';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';
import { SuiteDeTesteAdapter } from './suite-de-teste.adapter';
import { SuiteDeTesteMapper } from './suite-de-teste.mapper';

// Define messages locally
const Messages = {
  ENTIDADE_NAO_ENCONTRADA: '{entidade} não encontrada',
  ENTIDADE_REMOVIDA: '{entidade} removida com sucesso',
};

@Injectable()
export class SuiteDeTesteService {
  constructor(
    @InjectRepository(SuiteDeTeste)
    private readonly suiteDeTesteRepository: Repository<SuiteDeTeste>,
    @Inject(forwardRef(() => CasoDeTesteService))
    private casoDeTesteService: CasoDeTesteService,
    private readonly projetoService: ProjetoService,
  ) {}

  /**
   * Cria uma nova suite de teste
   * @param createSuiteDeTesteDto Dados da suite de teste
   * @param projetoId ID do projeto
   * @returns Suite de teste criada
   */
  async create(
    createSuiteDeTesteDto: CreateSuiteDeTesteDto,
    projetoId: number,
  ): Promise<SuiteDeTesteDto> {
    const projeto = await this.projetoService.findOne(projetoId);

    if (!projeto) {
      throw new NotFoundException(
        Messages.ENTIDADE_NAO_ENCONTRADA.replace('{entidade}', 'Projeto'),
      );
    }

    const partialEntity = SuiteDeTesteMapper.createSuiteDeTesteDtoToBo(
      createSuiteDeTesteDto,
    );

    // Set projeto relation
    partialEntity.projeto = projeto;

    if (createSuiteDeTesteDto.suitePaiId) {
      const suitePai = await this.suiteDeTesteRepository.findOne({
        where: { id: createSuiteDeTesteDto.suitePaiId },
      });
      if (suitePai) {
        partialEntity.suitePai = suitePai;
      }
    }

    const suiteDeTeste = await this.suiteDeTesteRepository.save(partialEntity);
    return SuiteDeTesteMapper.boToDto(suiteDeTeste);
  }

  /**
   * Lista suites de teste com paginação
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de suites de teste
   */
  async findAll(
    projetoId: number,
    page: number = 0,
    pageSize: number = 10,
  ): Promise<PaginatedResult<SuiteDeTesteDto>> {
    const skip = page * pageSize;

    const [suitesDeTeste, total] =
      await this.suiteDeTesteRepository.findAndCount({
        where: {
          projeto: { id: projetoId },
        },
        relations: ['suitePai', 'projeto'],
        skip,
        take: pageSize,
      });

    const items = suitesDeTeste.map((suite) =>
      SuiteDeTesteMapper.boToDto(suite),
    );

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: pageSize,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
    };
  }

  /**
   * Busca suites de teste por nome
   * @param nome Nome para filtrar
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de suites de teste
   */
  async findByNome(
    nome: string,
    projetoId: number,
    page: number = 0,
    pageSize: number = 10,
  ): Promise<PaginatedResult<SuiteDeTesteDto>> {
    const skip = page * pageSize;

    const [suitesDeTeste, total] =
      await this.suiteDeTesteRepository.findAndCount({
        where: {
          nome: Like(`%${nome}%`),
          projeto: { id: projetoId },
        },
        relations: ['suitePai', 'projeto'],
        skip,
        take: pageSize,
      });

    const items = suitesDeTeste.map((suite) =>
      SuiteDeTesteMapper.boToDto(suite),
    );

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: pageSize,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
    };
  }

  /**
   * Busca suite de teste por ID
   * @param id ID da suite de teste
   * @returns Suite de teste encontrada
   */
  async findOne(id: number): Promise<SuiteDeTesteDto> {
    const suiteDeTeste = await this.suiteDeTesteRepository.findOne({
      where: { id },
      relations: ['suitePai', 'projeto', 'suites', 'casosDeTeste'],
    });

    if (!suiteDeTeste) {
      throw new NotFoundException(
        Messages.ENTIDADE_NAO_ENCONTRADA.replace(
          '{entidade}',
          'Suite de teste',
        ),
      );
    }

    return SuiteDeTesteMapper.boToDto(suiteDeTeste);
  }

  async getFileTree(projeto: Projeto, suiteId?: number) {
    let entities: SuiteDeTeste[];

    if (suiteId) {
      const suiteEntity = await this.suiteDeTesteRepository.findOne({
        where: { id: suiteId },
      });

      if (!suiteEntity) {
        throw new Error('Suite de teste não encontrada');
      }

      // Use recursive query to find descendants
      const queryBuilder = this.suiteDeTesteRepository
        .createQueryBuilder('suite')
        .leftJoinAndSelect('suite.casosDeTeste', 'casosDeTeste')
        .leftJoinAndSelect('suite.projeto', 'projeto')
        .leftJoinAndSelect('suite.suites', 'suites')
        .where('suite.id = :id', { id: suiteId });

      const suite = await queryBuilder.getOne();
      entities = suite ? [suite] : [];
    } else {
      // Find root suites for a project
      const queryBuilder = this.suiteDeTesteRepository
        .createQueryBuilder('suite')
        .leftJoinAndSelect('suite.casosDeTeste', 'casosDeTeste')
        .leftJoinAndSelect('suite.projeto', 'projeto')
        .leftJoinAndSelect('suite.suites', 'suites')
        .where('suite.projeto.id = :projetoId', { projetoId: projeto.id })
        .andWhere('suite.suitePai IS NULL');

      entities = await queryBuilder.getMany();
    }

    const casos = !suiteId
      ? await this.casoDeTesteService.findAllWithoutSuite(+projeto.id)
      : [];

    const fileTree = SuiteDeTesteAdapter.makeFileTreeBo(entities, casos);

    return fileTree;
  }

  /**
   * Atualiza uma suite de teste
   * @param id ID da suite de teste
   * @param updateSuiteDeTesteDto Dados a serem atualizados
   * @returns Suite de teste atualizada
   */
  async update(
    id: number,
    updateSuiteDeTesteDto: UpdateSuiteDeTesteDto,
  ): Promise<SuiteDeTesteDto> {
    // Get the existing entity
    const existingSuite = await this.suiteDeTesteRepository.findOne({
      where: { id },
      relations: ['suitePai', 'projeto', 'suites', 'casosDeTeste'],
    });

    if (!existingSuite) {
      throw new NotFoundException(
        Messages.ENTIDADE_NAO_ENCONTRADA.replace(
          '{entidade}',
          'Suite de teste',
        ),
      );
    }

    // Update fields from DTO
    const suiteToUpdate = {
      ...existingSuite,
      ...SuiteDeTesteMapper.updateSuiteDeTesteDtoToBo(updateSuiteDeTesteDto),
    };

    if (updateSuiteDeTesteDto.suitePaiId) {
      const suitePaiEntity = await this.suiteDeTesteRepository.findOne({
        where: { id: updateSuiteDeTesteDto.suitePaiId },
      });

      if (!suitePaiEntity) {
        throw new NotFoundException(
          Messages.ENTIDADE_NAO_ENCONTRADA.replace(
            '{entidade}',
            'Suite de teste pai',
          ),
        );
      }

      suiteToUpdate.suitePai = suitePaiEntity;
    }

    const updated = await this.suiteDeTesteRepository.save(suiteToUpdate);
    return SuiteDeTesteMapper.boToDto(updated);
  }

  /**
   * Remove uma suite de teste
   * @param id ID da suite de teste
   * @returns Mensagem de confirmação
   */
  async remove(id: number): Promise<{ message: string }> {
    const suiteDeTeste = await this.findOne(id);
    await this.suiteDeTesteRepository.delete(id);

    return {
      message: Messages.ENTIDADE_REMOVIDA.replace(
        '{entidade}',
        'Suite de teste',
      ),
    };
  }

  async runSuite(id: number) {
    const screenshots = [];
    const driver = new Builder().forBrowser(Browser.CHROME).build();
    await driver.get('http://www.google.com');
    screenshots.push(await driver.takeScreenshot());
    await driver.findElement({ name: 'q' }).sendKeys('webdriver');
    screenshots.push(await driver.takeScreenshot());
    await driver.findElement({ name: 'q' }).submit();
    try {
      await driver.wait(async () => {
        screenshots.push(await driver.takeScreenshot());
        return driver
          .getPageSource()
          .then((source) => source.includes('Selenium'));
      }, 1000);
      await driver.quit();
      Logger.log('Teste finalizado com sucesso', 'SuiteDeTesteService');
    } catch (error) {
      screenshots.push(await driver.takeScreenshot());
      Logger.error('Teste falhou', 'SuiteDeTesteService');
      await driver.quit();
    }
    screenshots.forEach((screenshot, index) => {
      fs.writeFileSync(
        `./src/screenshots/screenshot-${index}.png`,
        screenshot,
        {
          encoding: 'base64',
        },
      );
    });
  }
}
