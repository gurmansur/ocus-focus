import { Component } from '@angular/core';
import { NodeDeTeste } from '../../shared/models/test-flow.models';
import { AcaoDeTesteService } from '../../shared/services/acao-de-teste.service';
import { ExecucaoDeTesteService } from '../../shared/services/execucao-de-teste.service';

@Component({
  selector: 'app-selenium-page',
  templateUrl: './selenium.page.html',
  styleUrls: ['./selenium.page.css'],
})
export class SeleniumPageComponent {
  casoDeTesteId?: number;
  nodes: NodeDeTeste[] = [];
  selected?: NodeDeTeste | null;
  executando = false;
  log: string[] = [];
  resultado?: any;

  constructor(
    private execService: ExecucaoDeTesteService,
    private acaoService: AcaoDeTesteService,
  ) {}

  addNode() {
    const id = Math.random().toString(36).slice(2);
    this.nodes.push({
      id,
      ordem: this.nodes.length + 1,
      tipo: 'NAVEGAR',
      posicao: { x: 16 + this.nodes.length * 24, y: 16 },
      dados: { descricao: 'Nova ação', timeout: 5000, obrigatorio: true },
    });
  }

  salvarNode(node: NodeDeTeste) {
    if (!this.casoDeTesteId) return;
    this.acaoService
      .create({
        ordem: node.ordem,
        tipo: node.tipo,
        seletor: node.dados.seletor,
        tipoSeletor: node.dados.tipoSeletor,
        valor: node.dados.valor,
        timeout: node.dados.timeout,
        descricao: node.dados.descricao,
        obrigatorio: !!node.dados.obrigatorio,
        mensagemErro: node.dados.mensagemErro,
        casoDeTesteId: this.casoDeTesteId,
      })
      .subscribe();
  }

  executar() {
    if (!this.casoDeTesteId) return;
    this.executando = true;
    this.log = [];
    this.resultado = null;

    this.execService.executarComStream(this.casoDeTesteId).subscribe({
      next: (event) => {
        if (event.type === 'log' || event.type === 'start') {
          this.log.push(event.message);
        } else if (event.type === 'complete') {
          this.resultado = event;
          this.log.push(
            `✓ Execução concluída: ${event.sucesso ? 'SUCESSO' : 'FALHA'}`,
          );
          this.executando = false;
        } else if (event.type === 'error') {
          this.log.push(`✗ Erro: ${event.message}`);
          this.executando = false;
        }
      },
      error: (err) => {
        this.log.push(`✗ Erro de conexão: ${err.message}`);
        this.executando = false;
      },
    });
  }
}
