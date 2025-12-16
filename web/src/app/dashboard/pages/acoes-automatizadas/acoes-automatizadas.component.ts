import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AcaoDeTesteDto,
  NodeDeTeste,
} from '../../../shared/models/test-flow.models';
import { AcaoDeTesteService } from '../../../shared/services/acao-de-teste.service';
import { ExecucaoDeTesteService } from '../../../shared/services/execucao-de-teste.service';

@Component({
  selector: 'app-acoes-automatizadas',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './acoes-automatizadas.component.html',
  styleUrls: ['./acoes-automatizadas.component.css'],
})
export class AcoesAutomatizadasComponent implements OnInit, OnChanges {
  @Input() casoDeTesteId?: number;

  nodes: NodeDeTeste[] = [];
  selectedNode?: NodeDeTeste | null;
  executando = false;
  showModal = false;
  log: { type: 'text' | 'image'; content: string }[] = [];
  resultado?: any;
  draggingNodeId?: string | null;
  snackbarMessage = '';
  snackbarType: 'success' | 'error' | 'info' = 'info';
  snackbarVisible = false;
  snackbarTimeout?: any;
  enlargedImage: string | null = null;

  tiposAcao = [
    'NAVEGAR',
    'CLICAR',
    'DIGITAR',
    'SELECIONAR',
    'ESPERAR',
    'VALIDAR_TEXTO',
    'VALIDAR_ELEMENTO',
    'SCREENSHOT',
    'EXECUTAR_SCRIPT',
    'SCROLL',
    'HOVER',
    'DUPLO_CLIQUE',
    'CLICAR_DIREITO',
    'LIMPAR_CAMPO',
    'PRESSIONAR_TECLA',
    'UPLOAD_ARQUIVO',
    'TROCAR_JANELA',
    'TROCAR_FRAME',
    'ACEITAR_ALERTA',
    'REJEITAR_ALERTA',
    'OBTER_TEXTO_ALERTA',
  ];

  tiposSeletor = ['ID', 'CLASS', 'CSS', 'XPATH', 'NAME', 'TAG', 'LINK_TEXT'];

  constructor(
    private acaoService: AcaoDeTesteService,
    private execService: ExecucaoDeTesteService
  ) {}

  ngOnInit() {
    this.carregarAcoes();
  }

  ngOnChanges() {
    if (this.casoDeTesteId) {
      this.carregarAcoes();
    }
  }

  carregarAcoes() {
    if (!this.casoDeTesteId) return;

    this.acaoService.findByCasoDeTesteId(this.casoDeTesteId).subscribe({
      next: (acoes: AcaoDeTesteDto[]) => {
        // Sort by ordem to maintain correct sequence
        const sortedAcoes = [...acoes].sort((a, b) => a.ordem - b.ordem);

        // Vertical list layout for sequential steps
        this.nodes = sortedAcoes.map((acao, index) => {
          return {
            id: acao.id.toString(),
            ordem: acao.ordem,
            tipo: acao.tipo,
            posicao: { x: 0, y: 0 }, // Position managed by flexbox
            dados: {
              seletor: acao.seletor,
              tipoSeletor: acao.tipoSeletor,
              valor: acao.valor,
              timeout: acao.timeout,
              descricao: acao.descricao,
              obrigatorio: acao.obrigatorio,
              mensagemErro: acao.mensagemErro,
            },
          };
        });
      },
      error: (err) => console.error('Erro ao carregar ações:', err),
    });
  }

  adicionarAcao() {
    const id = `new-${Date.now()}`;
    const index = this.nodes.length;

    const newNode: NodeDeTeste = {
      id,
      ordem: this.nodes.length + 1,
      tipo: 'NAVEGAR',
      posicao: { x: 0, y: 0 },
      dados: {
        descricao: 'Nova ação',
        timeout: 5000,
        obrigatorio: true,
      },
    };
    this.nodes.push(newNode);
    this.selectedNode = newNode;
  }

  selecionarNode(node: NodeDeTeste) {
    this.selectedNode = node;
  }

  removerNode(node: NodeDeTeste) {
    if (!node.id.startsWith('new-') && this.casoDeTesteId) {
      this.acaoService.remove(parseInt(node.id)).subscribe({
        next: () => {
          this.nodes = this.nodes.filter((n) => n.id !== node.id);
          if (this.selectedNode?.id === node.id) {
            this.selectedNode = null;
          }
        },
        error: (err) => console.error('Erro ao remover ação:', err),
      });
    } else {
      this.nodes = this.nodes.filter((n) => n.id !== node.id);
      if (this.selectedNode?.id === node.id) {
        this.selectedNode = null;
      }
    }
  }

  salvarNode() {
    if (!this.selectedNode || !this.casoDeTesteId) return;

    const payload = {
      ordem: this.selectedNode.ordem,
      tipo: this.selectedNode.tipo,
      seletor: this.selectedNode.dados.seletor,
      tipoSeletor: this.selectedNode.dados.tipoSeletor,
      valor: this.selectedNode.dados.valor,
      timeout: this.selectedNode.dados.timeout,
      descricao: this.selectedNode.dados.descricao,
      obrigatorio: !!this.selectedNode.dados.obrigatorio,
      mensagemErro: this.selectedNode.dados.mensagemErro,
      casoDeTesteId: this.casoDeTesteId,
    };

    if (this.selectedNode.id.startsWith('new-')) {
      this.acaoService.create(payload).subscribe({
        next: (acao) => {
          const node = this.nodes.find((n) => n.id === this.selectedNode?.id);
          if (node) {
            node.id = acao.id.toString();
          }
          this.showSnackbar('Ação salva com sucesso!', 'success');
        },
        error: (err) => {
          console.error('Erro ao salvar ação:', err);
          this.showSnackbar('Erro ao salvar ação', 'error');
        },
      });
    } else {
      this.acaoService
        .update(parseInt(this.selectedNode.id), payload)
        .subscribe({
          next: () =>
            this.showSnackbar('Ação atualizada com sucesso!', 'success'),
          error: (err) => {
            console.error('Erro ao atualizar ação:', err);
            this.showSnackbar('Erro ao atualizar ação', 'error');
          },
        });
    }
  }

  executar() {
    if (!this.casoDeTesteId) return;

    this.executando = true;
    this.showModal = true;
    this.log = [];
    this.resultado = null;

    this.execService.executarComStream(this.casoDeTesteId).subscribe({
      next: (event) => {
        if (event.type === 'log' || event.type === 'start') {
          this.log.push({ type: 'text', content: event.message });
        } else if (event.type === 'image') {
          this.log.push({ type: 'image', content: event.src });
        } else if (event.type === 'complete') {
          this.resultado = event;
          this.log.push({
            type: 'text',
            content: `✓ Execução concluída: ${
              event.sucesso ? 'SUCESSO' : 'FALHA'
            }`,
          });
          this.executando = false;
        } else if (event.type === 'error') {
          this.log.push({ type: 'text', content: `✗ Erro: ${event.message}` });
          this.executando = false;
        }
      },
      error: (err) => {
        this.log.push({
          type: 'text',
          content: `✗ Erro de conexão: ${err.message || 'Erro desconhecido'}`,
        });
        this.executando = false;
      },
    });
  }

  fecharModal() {
    this.showModal = false;
    this.log = [];
    this.executando = false;
  }

  private showSnackbar(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) {
    this.snackbarMessage = message;
    this.snackbarType = type;
    this.snackbarVisible = true;

    if (this.snackbarTimeout) {
      clearTimeout(this.snackbarTimeout);
    }

    this.snackbarTimeout = setTimeout(() => {
      this.snackbarVisible = false;
    }, 3000);
  }

  openImage(src: string) {
    this.enlargedImage = src;
  }

  closeImage() {
    this.enlargedImage = null;
  }

  onDrop(event: CdkDragDrop<NodeDeTeste[]>) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    console.log(
      `Dropped: previousIndex=${previousIndex}, currentIndex=${currentIndex}`
    );

    // If position didn't change, nothing to do
    if (previousIndex === currentIndex) {
      this.draggingNodeId = null;
      return;
    }

    // Move the item in the array
    moveItemInArray(this.nodes, previousIndex, currentIndex);

    // Calculate the range of affected items
    const startIdx = Math.min(previousIndex, currentIndex);
    const endIdx = Math.max(previousIndex, currentIndex);

    console.log(`Updating items from index ${startIdx} to ${endIdx}`);

    // Update ordem for all affected items and send PATCH requests
    for (let i = startIdx; i <= endIdx; i++) {
      const node = this.nodes[i];
      const newOrdem = i + 1;

      console.log(`Node ${node.id}: ordem ${node.ordem} -> ${newOrdem}`);

      node.ordem = newOrdem;

      // Send PATCH request for saved nodes
      if (!node.id.startsWith('new-') && this.casoDeTesteId) {
        console.log(`Sending PATCH for node ${node.id} with ordem ${newOrdem}`);
        this.acaoService
          .update(parseInt(node.id), { ordem: newOrdem })
          .subscribe({
            next: () =>
              console.log(`✓ Node ${node.id} updated to ordem ${newOrdem}`),
            error: (err) =>
              console.error(`✗ Error updating node ${node.id}:`, err),
          });
      }
    }

    this.draggingNodeId = null;
  }

  onDragStarted(node: NodeDeTeste) {
    this.draggingNodeId = node.id;
    console.log('Drag started for node:', node.id);
  }

  onDragEnded() {
    console.log('Drag ended');
  }
}
