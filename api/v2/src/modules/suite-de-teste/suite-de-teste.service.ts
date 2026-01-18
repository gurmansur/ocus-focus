import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Browser, Builder } from 'selenium-webdriver';
import { FindManyOptions, FindOneOptions, TreeRepository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { CasoDeTesteService } from '../caso-de-teste/caso-de-teste.service';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateSuiteDeTesteBo } from './bo/create-suite-de-teste.bo';
import { SuiteDeTesteBo } from './bo/suite-de-teste.bo';
import { UpdateSuiteDeTesteBo } from './bo/update-suite-de-teste.bo';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';
import { SuiteDeTesteAdapter } from './suite-de-teste.adapter';
import { SuiteDeTesteMapper } from './suite-de-teste.mapper';

@Injectable()
export class SuiteDeTesteService {
  constructor(
    @InjectRepository(SuiteDeTeste)
    private suiteDeTesteRepository: TreeRepository<SuiteDeTeste>,
    @Inject(forwardRef(() => CasoDeTesteService))
    private casoDeTesteService: CasoDeTesteService,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async create(
    createSuiteDeTesteBo: CreateSuiteDeTesteBo,
    projeto: Projeto,
  ): Promise<SuiteDeTesteBo> {
    const entity =
      SuiteDeTesteMapper.createSuiteDeTesteBoToEntity(createSuiteDeTesteBo);

    if (createSuiteDeTesteBo.suitePaiId) {
      const parentSuite = await this.findOne(
        createSuiteDeTesteBo.suitePaiId,
        projeto,
      );

      if (!parentSuite) {
        throw new Error('Suite de teste pai não encontrada');
      }

      entity.suitePai = parentSuite;
    }

    entity.projeto = projeto;

    return SuiteDeTesteMapper.entityToBo(
      await this.suiteDeTesteRepository.save(entity),
    );
  }

  async findAll(projeto?: Projeto) {
    const findOptions: FindManyOptions<SuiteDeTeste> = {
      relations: ['suitePai', 'casosDeTeste', 'projeto'],
      loadEagerRelations: true,
    };

    if (projeto) {
      findOptions.where = { projeto: { id: projeto.id } };
    }

    const entities = await this.suiteDeTesteRepository.find(findOptions);

    return entities.map((entity) => SuiteDeTesteMapper.entityToBo(entity));
  }

  async findOne(id: number, projeto?: Projeto) {
    const findOptions: FindOneOptions<SuiteDeTeste> = {
      where: { id },
      relations: ['suitePai', 'casosDeTeste', 'projeto'],
      loadEagerRelations: true,
    };

    if (projeto) {
      findOptions.where = { id, projeto: { id: projeto.id } };
    }

    const entity = await this.suiteDeTesteRepository.findOne(findOptions);

    if (!entity) {
      return null;
    }

    // Verify project ownership if projeto is provided
    if (projeto && entity.projeto?.id !== projeto.id) {
      return null;
    }

    return entity;
  }

  async getFileTree(projeto: Projeto, suiteId?: number) {
    let entities: SuiteDeTeste[];

    if (suiteId) {
      const suiteEntity = await this.suiteDeTesteRepository.findOne({
        where: { id: suiteId, projeto: { id: projeto.id } },
        relations: ['projeto'],
      });

      if (!suiteEntity) {
        throw new Error('Suite de teste não encontrada');
      }

      const suite = await this.suiteDeTesteRepository.findDescendantsTree(
        suiteEntity,
        {
          relations: ['casosDeTeste'],
        },
      );
      entities = [suite];
    } else {
      const rootSuites = await this.suiteDeTesteRepository.find({
        where: { projeto: { id: projeto.id }, suitePai: null },
        relations: ['casosDeTeste'],
        loadEagerRelations: true,
      });

      entities = await Promise.all(
        rootSuites.map((suite) =>
          this.suiteDeTesteRepository.findDescendantsTree(suite, {
            relations: ['casosDeTeste'],
          }),
        ),
      );
    }

    const casos = !suiteId
      ? await this.casoDeTesteService.findAllWithoutSuite(projeto)
      : [];

    return SuiteDeTesteAdapter.makeFileTreeBo(entities, casos);
  }

  async update(
    id: number,
    updateSuiteDeTesteBo: UpdateSuiteDeTesteBo,
    projeto?: Projeto,
  ): Promise<SuiteDeTesteBo> {
    const updateEntity =
      SuiteDeTesteMapper.updateSuiteDeTesteBoToEntity(updateSuiteDeTesteBo);

    const entity = await this.suiteDeTesteRepository.findOne({
      where: { id },
      relations: ['projeto', 'suitePai'],
    });

    if (!entity) {
      throw new Error('Suite de teste não encontrada');
    }

    // Verify project ownership if provided
    if (projeto && entity.projeto?.id !== projeto.id) {
      throw new Error('Suite de teste não encontrada');
    }

    updateEntity.suitePai = entity.suitePai;

    return SuiteDeTesteMapper.entityToBo(
      await this.suiteDeTesteRepository.save({
        ...entity,
        ...updateEntity,
      }),
    );
  }

  async changeSuite(id: number, suiteId: number, projeto?: Projeto) {
    const suite = await this.suiteDeTesteRepository.findOne({
      where: { id },
      relations: ['projeto'],
    });

    // Verify project ownership if provided
    if (projeto && suite?.projeto?.id !== projeto.id) {
      throw new Error('Suite de teste não encontrada');
    }

    if (suiteId === id) {
      throw new Error('Suite de teste pai inválida');
    }

    let parentSuite: SuiteDeTeste;

    if (suiteId) {
      parentSuite = await this.suiteDeTesteRepository.findOne({
        where: { id: suiteId },
        relations: ['projeto'],
      });

      // Verify parent suite belongs to same project
      if (projeto && parentSuite?.projeto?.id !== projeto.id) {
        throw new Error('Suite de teste pai não encontrada');
      }
    }

    if (!suite || (suiteId && !parentSuite)) {
      throw new Error('Suite de teste não encontrada');
    }

    suite.suitePai = parentSuite || null;

    return SuiteDeTesteMapper.entityToBo(
      await this.suiteDeTesteRepository.save(suite),
    );
  }

  async remove(id: number, projeto?: Projeto) {
    const entity = await this.suiteDeTesteRepository.findOne({
      where: { id },
      relations: ['projeto'],
    });

    if (!entity) {
      throw new Error('Suite de teste não encontrada');
    }

    // Verify project ownership if provided
    if (projeto && entity.projeto?.id !== projeto.id) {
      throw new Error('Suite de teste não encontrada');
    }

    return this.suiteDeTesteRepository.softDelete(id);
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
