import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateConfiguracaoSeleniumBo } from './bo/create-configuracao-selenium.bo';
import { UpdateConfiguracaoSeleniumBo } from './bo/update-configuracao-selenium.bo';
import { ConfiguracaoSeleniumMapper } from './configuracao-selenium.mapper';
import { ConfiguracaoSelenium } from './entities/configuracao-selenium.entity';

@Injectable()
export class ConfiguracaoSeleniumService {
  constructor(
    @InjectRepository(ConfiguracaoSelenium)
    private configuracaoSeleniumRepository: Repository<ConfiguracaoSelenium>,
  ) {}

  async create(createConfiguracaoSeleniumBo: CreateConfiguracaoSeleniumBo) {
    const entity = ConfiguracaoSeleniumMapper.createBoToEntity(
      createConfiguracaoSeleniumBo,
    );

    return ConfiguracaoSeleniumMapper.entityToBo(
      await this.configuracaoSeleniumRepository.save(entity),
    );
  }

  async findAll(projeto: Projeto) {
    const entities = await this.configuracaoSeleniumRepository.find({
      where: { projeto: { id: projeto.id } },
      order: { nome: 'ASC' },
    });

    return entities.map((entity) =>
      ConfiguracaoSeleniumMapper.entityToBo(entity),
    );
  }

  async findOne(id: number) {
    const entity = await this.configuracaoSeleniumRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new BadRequestException('Configuração não encontrada');
    }

    return ConfiguracaoSeleniumMapper.entityToBo(entity);
  }

  async findAtivaPorProjeto(projeto: Projeto) {
    const entity = await this.configuracaoSeleniumRepository.findOne({
      where: { projeto: { id: projeto.id }, ativa: true },
      order: { dataCriacao: 'DESC' },
    });

    if (!entity) {
      // Retorna uma configuração padrão se não houver nenhuma configuração ativa
      return this.getConfiguracaoPadrao();
    }

    return ConfiguracaoSeleniumMapper.entityToBo(entity);
  }

  async update(
    id: number,
    updateConfiguracaoSeleniumBo: UpdateConfiguracaoSeleniumBo,
  ) {
    const entity = ConfiguracaoSeleniumMapper.updateBoToEntity(
      updateConfiguracaoSeleniumBo,
    );

    await this.configuracaoSeleniumRepository.update(id, entity);

    return this.findOne(id);
  }

  async remove(id: number) {
    return this.configuracaoSeleniumRepository.softDelete(id);
  }

  private getConfiguracaoPadrao() {
    return {
      id: 0,
      nome: 'Padrão',
      navegador: 'CHROME',
      headless: false,
      timeoutPadrao: 30000,
      timeoutImplicito: 10000,
      timeoutCarregamentoPagina: 60000,
      resolucao: '1920x1080',
      maximizarJanela: true,
      aceitarCertificadosSSL: true,
      capturarScreenshots: true,
      capturarLogs: true,
      ativa: true,
      projetoId: 0,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };
  }
}
