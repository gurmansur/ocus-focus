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
   * Validates JavaScript code before execution to prevent code injection.
   * Only allows safe, read-only operations and common DOM manipulations.
   * @param script - The JavaScript code to validate
   * @throws Error if the script contains potentially dangerous operations
   */
  private validateScript(script: string): void {
    if (!script || script.trim().length === 0) {
      throw new Error('Script cannot be empty');
    }

    // List of dangerous patterns that should not be allowed
    const dangerousPatterns = [
      /eval\s*\(/i,
      /Function\s*\(/i,
      /setTimeout\s*\(/i,
      /setInterval\s*\(/i,
      /(window|document)\.location/i,
      /\.innerHTML\s*=/i,
      /\.outerHTML\s*=/i,
      /document\.write/i,
      /document\.writeln/i,
      /\.protocol\s*=/i,
      /import\s+/i,
      /require\s*\(/i,
      /fetch\s*\(/i,
      /XMLHttpRequest/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(script)) {
        // Log only a truncated version to avoid exposing sensitive information
        const truncated = script.length > 50 ? `${script.substring(0, 50)}...` : script;
        this.logger.warn(`Potentially dangerous script detected (truncated): ${truncated}`);
        throw new Error(
          `Script contains potentially dangerous operations. Pattern: ${pattern.source}`,
        );
      }
    }

    this.logger.log(`Script validated successfully: ${script.substring(0, 100)}`);
  }

  /**
   * Escapes a string for safe use in XPath expressions.
   * Handles strings containing both single and double quotes.
   * Uses concat() function to properly escape all quote combinations.
   */
  private escapeXPath(value: string): string {
    if (!value) {
      return "''";
    }
    
    // If no single quotes, wrap in single quotes
    if (!value.includes("'")) {
      return `'${value}'`;
    }
    
    // If no double quotes, wrap in double quotes
    if (!value.includes('"')) {
      return `"${value}"`;
    }
    
    // If both quotes are present, use concat with proper escaping
    // Split by single quote and build concat expression
    const parts = value.split("'");
    const concatParts: string[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Add the text part if not empty
      if (part.length > 0) {
        concatParts.push(`'${part}'`);
      }
      // Add the single quote that was removed by split (except after the last part)
      if (i < parts.length - 1) {
        concatParts.push(`"'"`);
      }
    }
    
    // Ensure we always have at least one part
    if (concatParts.length === 0) {
      return "''";
    }
    
    return `concat(${concatParts.join(',')})`;
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
        // Validate script before execution to prevent code injection
        this.validateScript(acao.valor);
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
