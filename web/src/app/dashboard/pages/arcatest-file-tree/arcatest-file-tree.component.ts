import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { MenuItem, TreeDragDropService, TreeNode } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { SidebarModule } from 'primeng/sidebar';
import { TreeModule, TreeNodeDropEvent } from 'primeng/tree';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ContentModalComponent } from '../../../shared/content-modal/content-modal.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { ExecucaoDeTesteService } from '../../../shared/services/execucao-de-teste.service';
import { CasoDeTeste } from '../../models/casoDeTeste';
import { FileTree } from '../../models/fileTree';
import { SuiteDeTeste } from '../../models/suiteDeTeste';
import { CasoDeTesteService } from '../../services/casoDeTeste.service';
import { ExecucaoDeTesteService as ExecucaoService } from '../../services/execucoesDeTeste.service';
import { SuiteDeTesteService } from '../../services/suiteDeTeste.service';
import { TestSuiteIconComponent } from '../painel-arcatest/components/test-suite-icon/test-suite-icon.component';
import { TestExecutionModalComponent } from '../shared/test-execution-modal/test-execution-modal.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

@Component({
  selector: 'app-arcatest-file-tree',
  standalone: true,
  imports: [
    CommonModule,
    ProjectHeaderComponent,
    NgxChartsModule,
    ContentModalComponent,
    ModalComponent,
    PlusIconComponent,
    ButtonComponent,
    TestSuiteIconComponent,
    TreeModule,
    ContextMenuModule,
    SidebarModule,
    PieChartComponent,
    TestExecutionModalComponent,
  ],
  providers: [TreeDragDropService, NodeIterator],
  templateUrl: './arcatest-file-tree.component.html',
  styleUrl: './arcatest-file-tree.component.css',
})
export class ArcatestFileTreeComponent {
  fileTree!: FileTree;
  projectId!: number;
  legendPosition: LegendPosition = LegendPosition.Below;
  openDelete: boolean = false;
  openCoverage: boolean = false;
  showModal: boolean = false;
  fileTreeNodes: TreeNode[] = [];
  @ViewChild('contextMenu') contextMenu!: ContextMenu;
  passed?: number = 0;
  failed?: number = 0;
  pending?: number = 0;
  selectedNode?: TreeNode;
  deleteTitle!: string;
  deleteMessage!: string;
  displaySidebar: boolean = false;
  executando = false;
  log: { type: 'text' | 'image'; content: string }[] = [];
  resultado?: any;
  contextMenuItems: MenuItem[] = [
    {
      label: 'Adicionar Caso de Teste',
      icon: 'hero-icon hero-document-plus',
      command: (event: any) => {
        this.router.navigate([
          '/dashboard/projeto/',
          this.projectId,
          'painel-arcatest',
          'casos-teste',
          'criar',
        ]);
      },
    },
    {
      label: 'Adicionar Suite de Teste',
      icon: 'hero-icon hero-folder-plus',
      command: (event: any) => {
        this.router.navigate([
          '/dashboard/projeto/',
          this.projectId,
          'painel-arcatest',
          'suites-teste',
          'criar',
        ]);
      },
    },
  ];

  constructor(
    @Inject(SuiteDeTesteService)
    private suiteDeTesteService: SuiteDeTesteService,
    private casoDeTesteService: CasoDeTesteService,
    private execucaoDeTesteService: ExecucaoService,
    private execService: ExecucaoDeTesteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.projectId = this.route.parent?.snapshot.params['id'];

    this.getFileTree();
  }

  onShowDetails(event: any) {
    console.log(this.selectedNode);
    this.displaySidebar = true;
    if (this.selectedNode?.type === 'suite') {
      this.execucaoDeTesteService
        .getGrafico(this.selectedNode?.data.id)
        .subscribe({
          next: (response) => {
            this.passed = response['SUCESSO'] || 0;
            this.failed = response['FALHA'] || 0;
            this.pending = response['PENDENTE'] || 0;
          },
        });
    }
  }

  onHideDetails(event: any) {
    this.selectedNode = undefined;
    this.displaySidebar = false;
  }

  getFileTree() {
    this.suiteDeTesteService.getFileTree().subscribe((response) => {
      this.fileTree = response;
      this.fileTreeNodes = this.fileTreeToNodes(this.fileTree);
    });
  }

  onContextMenuSelect(event: any) {
    this.selectedNode = event.node;

    // Update context menu items based on node type
    if (
      this.selectedNode?.type === 'suite' ||
      this.selectedNode?.type === 'case'
    ) {
      this.contextMenuItems = [
        {
          label: 'Detalhes',
          icon: 'hero-icon hero-info',
          command: (event: any) => {
            this.displaySidebar = true;
          },
        },
        {
          label: 'Editar',
          icon: 'hero-icon hero-pencil',
          command: (event: any) => {
            if (this.selectedNode?.type === 'suite') {
              this.router.navigate([
                '/dashboard/projeto/',
                this.projectId,
                'painel-arcatest',
                'suites-teste',
                this.selectedNode?.data.id,
                'editar',
              ]);
            } else if (this.selectedNode?.type === 'case') {
              this.router.navigate([
                '/dashboard/projeto/',
                this.projectId,
                'painel-arcatest',
                'casos-teste',
                this.selectedNode?.data.id,
                'editar',
              ]);
            }
          },
        },
        ...(this.selectedNode?.type === 'case'
          ? [
              {
                label: 'Executar Teste',
                icon: 'hero-icon hero-play',
                command: (event: any) => {
                  this.executeTest();
                },
              },
            ]
          : []),
        ...(this.selectedNode?.type === 'suite'
          ? [
              {
                label: 'Executar Suite',
                icon: 'hero-icon hero-play',
                command: (event: any) => {
                  this.executarSuite();
                },
              },
            ]
          : []),
        {
          separator: true,
          style: {
            'margin-top': '2px',
            'margin-bottom': '2px',
            'border-bottom': '1px solid #f0f0f0',
          },
        },
        {
          label: 'Adicionar Caso de Teste',
          icon: 'hero-icon hero-document-plus',
          command: (event: any) => {
            this.router.navigate(
              [
                '/dashboard/projeto/',
                this.projectId,
                'painel-arcatest',
                'casos-teste',
                'criar',
              ],
              {
                queryParams: {
                  suiteId:
                    this.selectedNode?.type === 'suite'
                      ? this.selectedNode?.data.id
                      : undefined,
                },
              },
            );
          },
        },
        {
          label: 'Adicionar Suite de Teste',
          icon: 'hero-icon hero-folder-plus',
          command: (event: any) => {
            this.router.navigate([
              '/dashboard/projeto/',
              this.projectId,
              'painel-arcatest',
              'suites-teste',
              'criar',
            ]);
          },
        },
        {
          label: 'Remover',
          icon: 'hero-icon hero-trash',
          style: { color: 'red' },
          styleClass: 'context-menu-delete',
          command: (event: any) => {
            this.openDeleteModal();
          },
        },
      ];
    } else {
      this.contextMenuItems = [
        {
          label: 'Adicionar Caso de Teste',
          icon: 'hero-icon hero-document-plus',
          command: (event: any) => {
            this.router.navigate([
              '/dashboard/projeto/',
              this.projectId,
              'painel-arcatest',
              'casos-teste',
              'criar',
            ]);
          },
        },
        {
          label: 'Adicionar Suite de Teste',
          icon: 'hero-icon hero-folder-plus',
          command: (event: any) => {
            this.router.navigate([
              '/dashboard/projeto/',
              this.projectId,
              'painel-arcatest',
              'suites-teste',
              'criar',
            ]);
          },
        },
      ];
    }
  }

  private fileTreeToNodes(fileTree: FileTree): TreeNode[] {
    const nodes = [
      ...this.childSuitesToNodes(fileTree.suites),
      ...this.childCasesToNodes(fileTree.casos),
    ];

    return nodes;
  }

  private childSuitesToNodes(children: SuiteDeTeste[], level = 0): TreeNode[] {
    return children.map((child) => {
      return {
        label: child.nome,
        data: child,
        styleClass: level === 0 ? 'root-node' : '',
        type: 'suite',
        collapsedIcon: 'hero-icon hero-folder',
        expandedIcon: 'hero-icon hero-folder-open',
        children: [
          ...this.childSuitesToNodes(child.suitesFilhas, level + 1),
          ...this.childCasesToNodes(child.casosDeTeste, level + 1),
        ],
      };
    });
  }

  private childCasesToNodes(children: CasoDeTeste[], level = 0): TreeNode[] {
    return children.map((child) => {
      return {
        icon: 'hero-icon hero-document',
        styleClass: level === 0 ? 'root-node' : '',
        type: 'case',
        label: child.nome,
        data: child,
      };
    });
  }

  onNodeDrop(event: TreeNodeDropEvent) {
    const target = event.originalEvent?.target as HTMLElement;
    if (event.dropNode?.type === 'suite' || target.tagName === 'LI') {
      event.accept && event.accept();
      if (event.dragNode?.type === 'suite') {
        event.dragNode.styleClass = target.tagName === 'LI' ? 'root-node' : '';
        this.suiteDeTesteService
          .changeSuite(
            event.dragNode?.data.id,
            target.tagName === 'LI' ? null : event.dropNode?.data.id,
          )
          .subscribe();
      } else if (event.dragNode?.type === 'case') {
        event.dragNode.styleClass = target.tagName === 'LI' ? 'root-node' : '';
        this.casoDeTesteService
          .changeSuite(
            event.dragNode?.data.id,
            target.tagName === 'LI' ? null : event.dropNode?.data.id,
          )
          .subscribe();
      }
    } else {
      return;
    }
  }

  onContextMenu(event: MouseEvent, node?: TreeNode) {}

  navigateToArcaTest() {
    this.router.navigate(['/dashboard/projeto/', this.projectId]);
  }

  closeDeleteModal() {
    this.openDelete = false;
  }

  deleteSelected() {
    if (this.selectedNode?.type === 'suite') {
      this.suiteDeTesteService
        .delete(this.selectedNode?.data.id)
        .subscribe(() => {
          this.getFileTree();
          this.openDelete = false;
        });
    } else if (this.selectedNode?.type === 'case') {
      this.casoDeTesteService
        .delete(this.selectedNode?.data.id)
        .subscribe(() => {
          this.getFileTree();
          this.openDelete = false;
        });
    }
  }

  openDeleteModal() {
    this.deleteTitle = `Excluir ${
      this.selectedNode?.type === 'suite' ? 'Suite' : 'Caso de Teste'
    }`;
    this.deleteMessage = `Tem certeza que deseja excluir ${
      this.selectedNode?.type === 'suite' ? 'a Suite' : 'o Caso de Teste'
    } "${this.selectedNode?.data.nome}"?`;

    this.openDelete = true;
  }

  openCoverageModal() {
    this.execucaoDeTesteService.getGrafico().subscribe({
      next: (response) => {
        this.passed = response['SUCESSO'] || 0;
        this.failed = response['FALHA'] || 0;
        this.pending = response['PENDENTE'] || 0;
        this.openCoverage = true;
      },
    });
  }

  closeCoverageModal() {
    this.openCoverage = false;
  }

  executeTest() {
    if (!this.selectedNode?.data?.id) return;

    this.executando = true;
    this.showModal = true;
    this.log = [];
    this.resultado = null;

    this.execService.executarComStream(this.selectedNode.data.id).subscribe({
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

  closeExecuteModal() {
    this.showModal = false;
    this.log = [];
    this.executando = false;
  }

  executarTodosProjeto() {
    this.executando = true;
    this.showModal = true;
    this.log = [];
    this.resultado = null;

    this.execService.executarProjetoComStream().subscribe({
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
                content: `✓ ${event.message}`,
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

  executarSuite() {
    if (!this.selectedNode?.data?.id) return;

    this.executando = true;
    this.showModal = true;
    this.log = [];
    this.resultado = null;

    this.execService
      .executarSuiteComStream(this.selectedNode.data.id)
      .subscribe({
        next: (event) => {
          this.ngZone.run(() => {
            if (event.type === 'log' || event.type === 'start') {
              this.log = [
                ...this.log,
                { type: 'text', content: event.message },
              ];
            } else if (event.type === 'image') {
              this.log = [...this.log, { type: 'image', content: event.src }];
            } else if (event.type === 'complete') {
              this.resultado = event;
              this.log = [
                ...this.log,
                {
                  type: 'text',
                  content: `✓ ${event.message}`,
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
}
