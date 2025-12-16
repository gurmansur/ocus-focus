import { Projeto } from '../projeto/entities/projeto.entity';
import { ConfiguracaoSeleniumBo } from './bo/configuracao-selenium.bo';
import { CreateConfiguracaoSeleniumBo } from './bo/create-configuracao-selenium.bo';
import { UpdateConfiguracaoSeleniumBo } from './bo/update-configuracao-selenium.bo';
import { ConfiguracaoSeleniumDto } from './dto/configuracao-selenium.dto';
import { CreateConfiguracaoSeleniumDto } from './dto/create-configuracao-selenium.dto';
import { UpdateConfiguracaoSeleniumDto } from './dto/update-configuracao-selenium.dto';
import { ConfiguracaoSelenium } from './entities/configuracao-selenium.entity';

export class ConfiguracaoSeleniumMapper {
  static entityToBo(entity: ConfiguracaoSelenium): ConfiguracaoSeleniumBo {
    if (!entity) return null;

    const bo = new ConfiguracaoSeleniumBo();
    bo.id = entity.id;
    bo.nome = entity.nome;
    bo.navegador = entity.navegador;
    bo.headless = entity.headless;
    bo.timeoutPadrao = entity.timeoutPadrao;
    bo.timeoutImplicito = entity.timeoutImplicito;
    bo.timeoutCarregamentoPagina = entity.timeoutCarregamentoPagina;
    bo.resolucao = entity.resolucao;
    bo.maximizarJanela = entity.maximizarJanela;
    bo.aceitarCertificadosSSL = entity.aceitarCertificadosSSL;
    bo.capturarScreenshots = entity.capturarScreenshots;
    bo.capturarLogs = entity.capturarLogs;
    bo.urlSeleniumGrid = entity.urlSeleniumGrid;
    bo.opcoesAdicionais = entity.opcoesAdicionais;
    bo.userAgent = entity.userAgent;
    bo.proxy = entity.proxy;
    bo.ativa = entity.ativa;
    bo.projetoId = entity.projeto?.id;
    bo.dataCriacao = entity.dataCriacao;
    bo.dataAtualizacao = entity.dataAtualizacao;

    return bo;
  }

  static boToDto(bo: ConfiguracaoSeleniumBo): ConfiguracaoSeleniumDto {
    if (!bo) return null;

    const dto = new ConfiguracaoSeleniumDto();
    dto.id = bo.id;
    dto.nome = bo.nome;
    dto.navegador = bo.navegador;
    dto.headless = bo.headless;
    dto.timeoutPadrao = bo.timeoutPadrao;
    dto.timeoutImplicito = bo.timeoutImplicito;
    dto.timeoutCarregamentoPagina = bo.timeoutCarregamentoPagina;
    dto.resolucao = bo.resolucao;
    dto.maximizarJanela = bo.maximizarJanela;
    dto.aceitarCertificadosSSL = bo.aceitarCertificadosSSL;
    dto.capturarScreenshots = bo.capturarScreenshots;
    dto.capturarLogs = bo.capturarLogs;
    dto.urlSeleniumGrid = bo.urlSeleniumGrid;
    dto.opcoesAdicionais = bo.opcoesAdicionais;
    dto.userAgent = bo.userAgent;
    dto.proxy = bo.proxy;
    dto.ativa = bo.ativa;
    dto.projetoId = bo.projetoId;
    dto.dataCriacao = bo.dataCriacao;
    dto.dataAtualizacao = bo.dataAtualizacao;

    return dto;
  }

  static createDtoToBo(
    dto: CreateConfiguracaoSeleniumDto,
  ): CreateConfiguracaoSeleniumBo {
    if (!dto) return null;

    const bo = new CreateConfiguracaoSeleniumBo();
    bo.nome = dto.nome;
    bo.navegador = dto.navegador;
    bo.headless = dto.headless ?? false;
    bo.timeoutPadrao = dto.timeoutPadrao ?? 30000;
    bo.timeoutImplicito = dto.timeoutImplicito ?? 10000;
    bo.timeoutCarregamentoPagina = dto.timeoutCarregamentoPagina ?? 60000;
    bo.resolucao = dto.resolucao ?? '1920x1080';
    bo.maximizarJanela = dto.maximizarJanela ?? true;
    bo.aceitarCertificadosSSL = dto.aceitarCertificadosSSL ?? true;
    bo.capturarScreenshots = dto.capturarScreenshots ?? true;
    bo.capturarLogs = dto.capturarLogs ?? true;
    bo.urlSeleniumGrid = dto.urlSeleniumGrid;
    bo.opcoesAdicionais = dto.opcoesAdicionais;
    bo.userAgent = dto.userAgent;
    bo.proxy = dto.proxy;
    bo.ativa = dto.ativa ?? true;
    bo.projetoId = dto.projetoId;

    return bo;
  }

  static createBoToEntity(
    bo: CreateConfiguracaoSeleniumBo,
  ): ConfiguracaoSelenium {
    if (!bo) return null;

    const entity = new ConfiguracaoSelenium();
    entity.nome = bo.nome;
    entity.navegador = bo.navegador as any;
    entity.headless = bo.headless ?? false;
    entity.timeoutPadrao = bo.timeoutPadrao ?? 30000;
    entity.timeoutImplicito = bo.timeoutImplicito ?? 10000;
    entity.timeoutCarregamentoPagina = bo.timeoutCarregamentoPagina ?? 60000;
    entity.resolucao = bo.resolucao ?? '1920x1080';
    entity.maximizarJanela = bo.maximizarJanela ?? true;
    entity.aceitarCertificadosSSL = bo.aceitarCertificadosSSL ?? true;
    entity.capturarScreenshots = bo.capturarScreenshots ?? true;
    entity.capturarLogs = bo.capturarLogs ?? true;
    entity.urlSeleniumGrid = bo.urlSeleniumGrid;
    entity.opcoesAdicionais = bo.opcoesAdicionais;
    entity.userAgent = bo.userAgent;
    entity.proxy = bo.proxy;
    entity.ativa = bo.ativa ?? true;

    if (bo.projetoId) {
      entity.projeto = { id: bo.projetoId } as Projeto;
    }

    return entity;
  }

  static updateDtoToBo(
    dto: UpdateConfiguracaoSeleniumDto,
  ): UpdateConfiguracaoSeleniumBo {
    if (!dto) return null;

    const bo = new UpdateConfiguracaoSeleniumBo();
    bo.nome = dto.nome;
    bo.navegador = dto.navegador;
    bo.headless = dto.headless;
    bo.timeoutPadrao = dto.timeoutPadrao;
    bo.timeoutImplicito = dto.timeoutImplicito;
    bo.timeoutCarregamentoPagina = dto.timeoutCarregamentoPagina;
    bo.resolucao = dto.resolucao;
    bo.maximizarJanela = dto.maximizarJanela;
    bo.aceitarCertificadosSSL = dto.aceitarCertificadosSSL;
    bo.capturarScreenshots = dto.capturarScreenshots;
    bo.capturarLogs = dto.capturarLogs;
    bo.urlSeleniumGrid = dto.urlSeleniumGrid;
    bo.opcoesAdicionais = dto.opcoesAdicionais;
    bo.userAgent = dto.userAgent;
    bo.proxy = dto.proxy;
    bo.ativa = dto.ativa;

    return bo;
  }

  static updateBoToEntity(
    bo: UpdateConfiguracaoSeleniumBo,
  ): Partial<ConfiguracaoSelenium> {
    if (!bo) return null;

    const entity: Partial<ConfiguracaoSelenium> = {};

    if (bo.nome !== undefined) entity.nome = bo.nome;
    if (bo.navegador !== undefined) entity.navegador = bo.navegador as any;
    if (bo.headless !== undefined) entity.headless = bo.headless;
    if (bo.timeoutPadrao !== undefined) entity.timeoutPadrao = bo.timeoutPadrao;
    if (bo.timeoutImplicito !== undefined)
      entity.timeoutImplicito = bo.timeoutImplicito;
    if (bo.timeoutCarregamentoPagina !== undefined)
      entity.timeoutCarregamentoPagina = bo.timeoutCarregamentoPagina;
    if (bo.resolucao !== undefined) entity.resolucao = bo.resolucao;
    if (bo.maximizarJanela !== undefined)
      entity.maximizarJanela = bo.maximizarJanela;
    if (bo.aceitarCertificadosSSL !== undefined)
      entity.aceitarCertificadosSSL = bo.aceitarCertificadosSSL;
    if (bo.capturarScreenshots !== undefined)
      entity.capturarScreenshots = bo.capturarScreenshots;
    if (bo.capturarLogs !== undefined) entity.capturarLogs = bo.capturarLogs;
    if (bo.urlSeleniumGrid !== undefined)
      entity.urlSeleniumGrid = bo.urlSeleniumGrid;
    if (bo.opcoesAdicionais !== undefined)
      entity.opcoesAdicionais = bo.opcoesAdicionais;
    if (bo.userAgent !== undefined) entity.userAgent = bo.userAgent;
    if (bo.proxy !== undefined) entity.proxy = bo.proxy;
    if (bo.ativa !== undefined) entity.ativa = bo.ativa;

    return entity;
  }
}
