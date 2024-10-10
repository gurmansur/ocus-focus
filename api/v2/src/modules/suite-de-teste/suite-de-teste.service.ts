import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Browser, Builder } from 'selenium-webdriver';
import { Repository } from 'typeorm';
import { CreateSuiteDeTesteBo } from './bo/create-suite-de-teste.bo';
import { SuiteDeTesteBo } from './bo/suite-de-teste.bo';
import { UpdateSuiteDeTesteBo } from './bo/update-suite-de-teste.bo';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';
import { SuiteDeTesteMapper } from './suite-de-teste.mapper';

@Injectable()
export class SuiteDeTesteService {
  constructor(
    @InjectRepository(SuiteDeTeste)
    private suiteDeTesteRepository: Repository<SuiteDeTeste>,
  ) {}

  async create(
    createSuiteDeTesteBo: CreateSuiteDeTesteBo,
  ): Promise<SuiteDeTesteBo> {
    const entity =
      SuiteDeTesteMapper.createSuiteDeTesteBoToEntity(createSuiteDeTesteBo);

    return SuiteDeTesteMapper.entityToBo(
      await this.suiteDeTesteRepository.save(entity),
    );
  }

  findAll() {
    return this.suiteDeTesteRepository.find();
  }

  findOne(id: number) {
    return this.suiteDeTesteRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateSuiteDeTesteBo: UpdateSuiteDeTesteBo,
  ): Promise<SuiteDeTesteBo> {
    const updateEntity =
      SuiteDeTesteMapper.updateSuiteDeTesteBoToEntity(updateSuiteDeTesteBo);

    const entity = await this.suiteDeTesteRepository.findOne({ where: { id } });

    return SuiteDeTesteMapper.entityToBo(
      await this.suiteDeTesteRepository.save({
        ...entity,
        ...updateEntity,
      }),
    );
  }

  remove(id: number) {
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
