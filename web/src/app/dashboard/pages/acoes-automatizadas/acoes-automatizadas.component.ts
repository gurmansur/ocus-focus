import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AcaoDeTesteDto,
  NodeDeTeste,
} from '../../../shared/models/test-flow.models';
import { AcaoDeTesteService } from '../../../shared/services/acao-de-teste.service';
import { ExecucaoDeTesteService } from '../../../shared/services/execucao-de-teste.service';
import { TestExecutionModalComponent } from '../shared/test-execution-modal/test-execution-modal.component';

@Component({
  selector: 'app-acoes-automatizadas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    TestExecutionModalComponent,
  ],
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

  tiposAcao = [
    { label: 'Navegar', value: 'NAVEGAR' },
    { label: 'Clique', value: 'CLICAR' },
    { label: 'Digitar', value: 'DIGITAR' },
    { label: 'Selecionar', value: 'SELECIONAR' },
    { label: 'Esperar', value: 'ESPERAR' },
    { label: 'Validar texto', value: 'VALIDAR_TEXTO' },
    { label: 'Validar elemento', value: 'VALIDAR_ELEMENTO' },
    { label: 'Screenshot', value: 'SCREENSHOT' },
    { label: 'Executar script', value: 'EXECUTAR_SCRIPT' },
    { label: 'Scroll', value: 'SCROLL' },
    { label: 'Hover', value: 'HOVER' },
    { label: 'Duplo clique', value: 'DUPLO_CLIQUE' },
    { label: 'Clique direito', value: 'CLICAR_DIREITO' },
    { label: 'Limpar campo', value: 'LIMPAR_CAMPO' },
    { label: 'Pressionar tecla', value: 'PRESSIONAR_TECLA' },
    { label: 'Upload de arquivo', value: 'UPLOAD_ARQUIVO' },
    { label: 'Trocar janela', value: 'TROCAR_JANELA' },
    { label: 'Trocar frame', value: 'TROCAR_FRAME' },
    { label: 'Aceitar alerta', value: 'ACEITAR_ALERTA' },
    { label: 'Rejeitar alerta', value: 'REJEITAR_ALERTA' },
    { label: 'Obter texto do alerta', value: 'OBTER_TEXTO_ALERTA' },
  ];

  tiposSeletor = [
    { label: 'ID', value: 'ID' },
    { label: 'Classe', value: 'CLASS' },
    { label: 'CSS', value: 'CSS' },
    { label: 'XPath', value: 'XPATH' },
    { label: 'Name', value: 'NAME' },
    { label: 'Tag', value: 'TAG' },
    { label: 'Link text', value: 'LINK_TEXT' },
  ];

  constructor(
    private acaoService: AcaoDeTesteService,
    private execService: ExecucaoDeTesteService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
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
        this.ngZone.run(() => {
          if (event.type === 'log' || event.type === 'start') {
            this.log = [...this.log, { type: 'text', content: event.message }];
          } else if (event.type === 'image') {
            this.log = [...this.log, { type: 'image', content: event.src }];
          } else if (event.type === 'complete') {
            this.resultado = event;
            this.log = [
              ...this.log,
              {
                type: 'text',
                content: `✓ Execução concluída: ${
                  event.sucesso ? 'SUCESSO' : 'FALHA'
                }`,
              },
            ];
            this.executando = false;
          } else if (event.type === 'error') {
            this.log = [
              ...this.log,
              {
                type: 'text',
                content: `✗ Erro: ${event.message}`,
              },
            ];
            this.executando = false;
          }
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.log = [
            ...this.log,
            {
              type: 'text',
              content: `✗ Erro de conexão: ${
                err.message || 'Erro desconhecido'
              }`,
            },
          ];
          this.executando = false;
          this.cdr.markForCheck();
        });
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

  getTipoLabel(tipo: string) {
    return this.tiposAcao.find((t) => t.value === tipo)?.label || tipo;
  }

  getTipoSeletorLabel(tipo: string | undefined) {
    if (!tipo) return '';
    return this.tiposSeletor.find((t) => t.value === tipo)?.label || tipo;
  }

  onDrop(event: CdkDragDrop<NodeDeTeste[]>) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

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

    // Update ordem for all affected items and send PATCH requests
    for (let i = startIdx; i <= endIdx; i++) {
      const node = this.nodes[i];
      const newOrdem = i + 1;

      node.ordem = newOrdem;

      // Send PATCH request for saved nodes
      if (!node.id.startsWith('new-') && this.casoDeTesteId) {
        this.acaoService
          .update(parseInt(node.id), { ordem: newOrdem })
          .subscribe({
            error: (err) =>
              console.error(`Error updating node ${node.id}:`, err),
          });
      }
    }

    this.draggingNodeId = null;
  }

  onDragStarted(node: NodeDeTeste) {
    this.draggingNodeId = node.id;
  }

  onDragEnded() {
    // Drag ended
  }
}
