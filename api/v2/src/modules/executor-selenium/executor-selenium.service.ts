import { Injectable, Logger } from '@nestjs/common';
import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as edge from 'selenium-webdriver/edge';
import * as firefox from 'selenium-webdriver/firefox';
import { AcaoDeTeste } from '../acao-de-teste/entities/acao-de-teste.entity';
import { ConfiguracaoSeleniumBo } from '../configuracao-selenium/bo/configuracao-selenium.bo';

export interface ResultadoExecucao {
  sucesso: boolean;
  mensagem: string;
  logs: string[];
  screenshots: string[];
  tempoExecucao: number;
  erros: Array<{
    acao: string;
    mensagem: string;
    timestamp: Date;
  }>;
}

@Injectable()
export class ExecutorSeleniumService {
  private readonly logger = new Logger(ExecutorSeleniumService.name);

  /**
   * Escapes a string for safe use in XPath expressions.
   * Handles strings containing both single and double quotes.
   */
  private escapeXPath(value: string): string {
    if (!value.includes("'")) {
      return `'${value}'`;
    }
    if (!value.includes('"')) {
      return `"${value}"`;
    }
    // If both quotes are present, use concat
    const parts = value.split("'");
    return `concat('${parts.join("',\"'\",'")}')`;;
  }

  async executarTeste(
    acoes: AcaoDeTeste[],
    configuracao: ConfiguracaoSeleniumBo,
    onLog?: (message: string) => void,
    onScreenshot?: (image: string) => void,
  ): Promise<ResultadoExecucao> {
    const inicioExecucao = Date.now();
    const resultado: ResultadoExecucao = {
      sucesso: true,
      mensagem: '',
      logs: [],
      screenshots: [],
      tempoExecucao: 0,
      erros: [],
    };

    let driver: WebDriver | null = null;

    const pushLog = (message: string) => {
      resultado.logs.push(message);
      if (onLog) onLog(message);
    };

    const pushScreenshot = (image: string) => {
      const normalized = image.startsWith('data:')
        ? image
        : `data:image/png;base64,${image}`;
      resultado.screenshots.push(normalized);
      if (onScreenshot) onScreenshot(normalized);
    };

    try {
      // Inicializar o driver do Selenium
      driver = await this.inicializarDriver(configuracao);
      pushLog('Driver inicializado com sucesso');

      // Ordenar ações pela ordem
      const acoesOrdenadas = [...acoes].sort((a, b) => a.ordem - b.ordem);

      // Executar cada ação
      for (const acao of acoesOrdenadas) {
        try {
          await this.executarAcao(
            driver,
            acao,
            configuracao,
            resultado,
            pushLog,
            pushScreenshot,
          );
          pushLog(`Ação ${acao.ordem} (${acao.tipo}) executada com sucesso`);
        } catch (error: any) {
          const mensagemErro =
            acao.mensagemErro || error?.message || 'Erro desconhecido';
          resultado.erros.push({
            acao: `${acao.ordem} - ${acao.tipo}`,
            mensagem: mensagemErro,
            timestamp: new Date(),
          });

          pushLog(`Erro na ação ${acao.ordem} (${acao.tipo}): ${mensagemErro}`);

          if (acao.obrigatorio) {
            resultado.sucesso = false;
            resultado.mensagem = `Falha na ação obrigatória: ${acao.descricao || acao.tipo}`;
            break;
          }
        }
      }

      if (resultado.sucesso && resultado.erros.length === 0) {
        resultado.mensagem = 'Teste executado com sucesso';
      } else if (resultado.sucesso) {
        resultado.mensagem = `Teste concluído com ${resultado.erros.length} erro(s) não crítico(s)`;
      }
    } catch (error) {
      resultado.sucesso = false;
      resultado.mensagem = `Erro fatal na execução: ${error.message}`;
      pushLog(`Erro fatal: ${error.message}`);
      this.logger.error('Erro na execução do teste', error.stack);
    } finally {
      // Fechar o driver
      if (driver) {
        try {
          await driver.quit();
          pushLog('Driver encerrado');
        } catch (error) {
          this.logger.warn('Erro ao fechar o driver', error);
        }
      }

      resultado.tempoExecucao = Date.now() - inicioExecucao;
    }

    return resultado;
  }

  private async inicializarDriver(
    configuracao: ConfiguracaoSeleniumBo,
  ): Promise<WebDriver> {
    let builder = new Builder();

    // Configurar o navegador
    switch (configuracao.navegador) {
      case 'CHROME':
        const chromeOptions = new chrome.Options();
        if (configuracao.headless) {
          chromeOptions.addArguments('--headless=new');
        }
        if (configuracao.userAgent) {
          chromeOptions.addArguments(`user-agent=${configuracao.userAgent}`);
        }
        if (configuracao.aceitarCertificadosSSL) {
          chromeOptions.addArguments('--ignore-certificate-errors');
        }
        chromeOptions.addArguments('--no-sandbox');
        chromeOptions.addArguments('--disable-dev-shm-usage');

        if (configuracao.opcoesAdicionais) {
          Object.entries(configuracao.opcoesAdicionais).forEach(
            ([key, value]) => {
              if (typeof value === 'string') {
                chromeOptions.addArguments(`${key}=${value}`);
              }
            },
          );
        }

        builder = builder.forBrowser('chrome').setChromeOptions(chromeOptions);
        break;

      case 'FIREFOX':
        const firefoxOptions = new firefox.Options();
        if (configuracao.headless) {
          firefoxOptions.addArguments('-headless');
        }
        if (configuracao.userAgent) {
          firefoxOptions.setPreference(
            'general.useragent.override',
            configuracao.userAgent,
          );
        }
        builder = builder
          .forBrowser('firefox')
          .setFirefoxOptions(firefoxOptions);
        break;

      case 'EDGE':
        const edgeOptions = new edge.Options();
        if (configuracao.headless) {
          edgeOptions.addArguments('--headless');
        }
        builder = builder
          .forBrowser('MicrosoftEdge')
          .setEdgeOptions(edgeOptions);
        break;

      default:
        throw new Error(`Navegador não suportado: ${configuracao.navegador}`);
    }

    // Selenium Grid
    if (configuracao.urlSeleniumGrid) {
      builder = builder.usingServer(configuracao.urlSeleniumGrid);
    }

    const driver = await builder.build();

    // Configurar timeouts
    await driver.manage().setTimeouts({
      implicit: configuracao.timeoutImplicito,
      pageLoad: configuracao.timeoutCarregamentoPagina,
      script: configuracao.timeoutPadrao,
    });

    // Configurar janela
    if (configuracao.maximizarJanela) {
      await driver.manage().window().maximize();
    } else if (configuracao.resolucao) {
      const [width, height] = configuracao.resolucao
        .split('x')
        .map((v) => parseInt(v, 10));
      await driver.manage().window().setRect({ width, height });
    }

    return driver;
  }

  private async executarAcao(
    driver: WebDriver,
    acao: AcaoDeTeste,
    configuracao: ConfiguracaoSeleniumBo,
    resultado: ResultadoExecucao,
    onLog?: (message: string) => void,
    onScreenshot?: (image: string) => void,
  ): Promise<void> {
    const timeout = acao.timeout || configuracao.timeoutPadrao;

    switch (acao.tipo) {
      case 'NAVEGAR':
        await driver.get(acao.valor);
        break;

      case 'CLICAR':
        const elementoClicar = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        await elementoClicar.click();
        break;

      case 'DUPLO_CLIQUE':
        const elementoDuploClicar = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        const actions = driver.actions({ async: true });
        await actions.doubleClick(elementoDuploClicar).perform();
        break;

      case 'CLICAR_DIREITO':
        const elementoCliqueDireito = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        const actionsContext = driver.actions({ async: true });
        await actionsContext.contextClick(elementoCliqueDireito).perform();
        break;

      case 'DIGITAR':
        const elementoDigitar = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        await elementoDigitar.sendKeys(acao.valor);
        break;

      case 'LIMPAR_CAMPO':
        const elementoLimpar = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        await elementoLimpar.clear();
        break;

      case 'SELECIONAR':
        const elementoSelecionar = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        await elementoSelecionar.click();
        const opcao = await elementoSelecionar.findElement(
          By.xpath(`//option[text()=${this.escapeXPath(acao.valor)}]`),
        );
        await opcao.click();
        break;

      case 'ESPERAR':
        await driver.sleep(parseInt(acao.valor, 10));
        break;

      case 'VALIDAR_TEXTO':
        const elementoValidar = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        const texto = await elementoValidar.getText();
        if (!texto.includes(acao.valor)) {
          throw new Error(
            `Texto esperado "${acao.valor}" não encontrado. Texto atual: "${texto}"`,
          );
        }
        break;

      case 'VALIDAR_ELEMENTO':
        await this.encontrarElemento(driver, acao, timeout);
        break;

      case 'SCREENSHOT':
        if (configuracao.capturarScreenshots) {
          const screenshot = await driver.takeScreenshot();
          const normalized = screenshot.startsWith('data:')
            ? screenshot
            : `data:image/png;base64,${screenshot}`;
          resultado.screenshots.push(normalized);
          if (onScreenshot) onScreenshot(normalized);
          if (onLog) onLog('Screenshot capturada');
        }
        break;

      case 'EXECUTAR_SCRIPT':
        await driver.executeScript(acao.valor);
        break;

      case 'SCROLL':
        const elementoScroll = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        await driver.executeScript(
          'arguments[0].scrollIntoView(true);',
          elementoScroll,
        );
        break;

      case 'HOVER':
        const elementoHover = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        const actionsHover = driver.actions({ async: true });
        await actionsHover.move({ origin: elementoHover }).perform();
        break;

      case 'PRESSIONAR_TECLA':
        const elementoTecla = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        await elementoTecla.sendKeys(acao.valor);
        break;

      case 'UPLOAD_ARQUIVO':
        const elementoUpload = await this.encontrarElemento(
          driver,
          acao,
          timeout,
        );
        await elementoUpload.sendKeys(acao.valor);
        break;

      case 'TROCAR_JANELA':
        const handles = await driver.getAllWindowHandles();
        const indice = parseInt(acao.valor, 10);
        if (handles[indice]) {
          await driver.switchTo().window(handles[indice]);
        } else {
          throw new Error(`Janela com índice ${indice} não encontrada`);
        }
        break;

      case 'TROCAR_FRAME':
        if (acao.valor === 'default' || acao.valor === 'parent') {
          await driver.switchTo().defaultContent();
        } else {
          const frame = await this.encontrarElemento(driver, acao, timeout);
          await driver.switchTo().frame(frame);
        }
        break;

      case 'ACEITAR_ALERTA':
        await driver.wait(until.alertIsPresent(), timeout);
        const alertaAceitar = await driver.switchTo().alert();
        await alertaAceitar.accept();
        break;

      case 'REJEITAR_ALERTA':
        await driver.wait(until.alertIsPresent(), timeout);
        const alertaRejeitar = await driver.switchTo().alert();
        await alertaRejeitar.dismiss();
        break;

      case 'OBTER_TEXTO_ALERTA':
        await driver.wait(until.alertIsPresent(), timeout);
        const alertaTexto = await driver.switchTo().alert();
        const textoAlerta = await alertaTexto.getText();
        resultado.logs.push(`Texto do alerta: ${textoAlerta}`);
        await alertaTexto.accept();
        break;

      default:
        throw new Error(`Tipo de ação não suportado: ${acao.tipo}`);
    }
  }

  private async encontrarElemento(
    driver: WebDriver,
    acao: AcaoDeTeste,
    timeout: number,
  ): Promise<WebElement> {
    const by = this.construirLocalizador(acao);

    await driver.wait(until.elementLocated(by), timeout);
    const element = await driver.findElement(by);
    await driver.wait(until.elementIsVisible(element), timeout);

    return element;
  }

  private construirLocalizador(acao: AcaoDeTeste): By {
    switch (acao.tipoSeletor) {
      case 'ID':
        return By.id(acao.seletor);
      case 'CLASS':
        return By.className(acao.seletor);
      case 'CSS':
        return By.css(acao.seletor);
      case 'XPATH':
        return By.xpath(acao.seletor);
      case 'NAME':
        return By.name(acao.seletor);
      case 'TAG':
        return By.tagName(acao.seletor);
      case 'LINK_TEXT':
        return By.linkText(acao.seletor);
      default:
        // Por padrão, usar CSS
        return By.css(acao.seletor);
    }
  }
}
