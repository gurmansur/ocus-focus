import { Injectable, Logger } from '@nestjs/common';
import { Browser, Builder } from 'selenium-webdriver';
import { CreateSuiteDeTesteDto } from './dto/create-suite-de-teste.dto';
import { UpdateSuiteDeTesteDto } from './dto/update-suite-de-teste.dto';

@Injectable()
export class SuiteDeTesteService {
  create(createSuiteDeTesteDto: CreateSuiteDeTesteDto) {
    return 'This action adds a new suiteDeTeste';
  }

  findAll() {
    return `This action returns all suiteDeTeste`;
  }

  findOne(id: number) {
    return `This action returns a #${id} suiteDeTeste`;
  }

  update(id: number, updateSuiteDeTesteDto: UpdateSuiteDeTesteDto) {
    return `This action updates a #${id} suiteDeTeste`;
  }

  remove(id: number) {
    return `This action removes a #${id} suiteDeTeste`;
  }

  async runSuite(id: number) {
    const driver = new Builder().forBrowser(Browser.CHROME).build();
    await driver.get('http://www.google.com');
    await driver.findElement({ name: 'q' }).sendKeys('webdriver');
    await driver.findElement({ name: 'q' }).submit();
    try {
      await driver.wait(
        () =>
          driver
            .getTitle()
            .then((title) => title === 'webdriver - Psquisa Google'),
        5000,
      );
      await driver.quit();
      Logger.log('Teste finalizado com sucesso', 'SuiteDeTesteService');
    } catch (error) {
      Logger.error('Teste falhou', 'SuiteDeTesteService');
      await driver.quit();
    }
  }
}
