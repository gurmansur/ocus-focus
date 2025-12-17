import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import {
  ConfiguracaoSeleniumDto,
  ConfiguracaoSeleniumService,
} from '../../../shared/services/configuracao-selenium.service';
import { TableComponent } from '../../../shared/table/table.component';

type ConfiguracaoSelenium = ConfiguracaoSeleniumDto;

@Component({
  selector: 'app-configuracao-selenium',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    PlusIconComponent,
  ],
  templateUrl: './configuracao-selenium.component.html',
  styleUrl: './configuracao-selenium.component.css',
})
export class ConfiguracaoSeleniumComponent implements OnInit {
  configuracoes: ConfiguracaoSelenium[] = [];
  projetoId!: number;
  openDeleteModal = false;

  columns = [
    'Nome',
    'Navegador',
    'Headless',
    'Resolução',
    'Screenshots',
    'Status',
  ];
  entityAttributes = [
    'nome',
    'navegador',
    'headlessLabel',
    'resolucao',
    'screenshotsLabel',
    'statusLabel',
  ];

  tableData: Array<
    ConfiguracaoSelenium & {
      headlessLabel: string;
      screenshotsLabel: string;
      statusLabel: string;
    }
  > = [];

  configuracao: ConfiguracaoSelenium = this.getEmptyConfiguracao();

  constructor(
    private configuracaoSeleniumService: ConfiguracaoSeleniumService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idFromParent =
      this.route.parent?.parent?.snapshot.params['id'] ??
      this.route.parent?.snapshot.params['id'] ??
      this.route.snapshot.params['id'];

    this.projetoId = Number(idFromParent);
    this.loadConfiguracoes();
  }

  loadConfiguracoes(): void {
    this.configuracaoSeleniumService.getAll().subscribe({
      next: (data) => {
        this.configuracoes = data as ConfiguracaoSelenium[];
        this.tableData = this.configuracoes.map((config) => ({
          ...config,
          headlessLabel: config.headless ? 'Sim' : 'Não',
          screenshotsLabel: config.capturarScreenshots ? 'Sim' : 'Não',
          statusLabel: config.ativa ? 'Ativa' : 'Inativa',
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar configurações:', error);
      },
    });
  }

  navigateToCreate(): void {
    this.router.navigate([
      '/dashboard/projeto',
      this.projetoId,
      'painel-arcatest',
      'configuracao-selenium',
      'criar',
    ]);
  }

  onEdit(id: number): void {
    this.router.navigate([
      '/dashboard/projeto',
      this.projetoId,
      'painel-arcatest',
      'configuracao-selenium',
      id,
      'editar',
    ]);
  }

  deleteConfiguracao(configuracao: ConfiguracaoSelenium): void {
    this.configuracao = { ...configuracao };
    this.openDeleteModal = true;
  }

  onDelete(id: number): void {
    const selected = this.configuracoes.find((item) => item.id === id);
    if (selected) {
      this.deleteConfiguracao(selected);
    }
  }

  confirmDelete(): void {
    if (!this.configuracao.id) return;

    this.configuracaoSeleniumService.delete(this.configuracao.id).subscribe({
      next: () => {
        this.loadConfiguracoes();
        this.openDeleteModal = false;
      },
      error: (error) => {
        console.error('Erro ao excluir configuração:', error);
      },
    });
  }

  closeDeleteModal(): void {
    this.openDeleteModal = false;
  }

  voltar(): void {
    this.router.navigate(['/dashboard/projeto', this.projetoId]);
  }

  private getEmptyConfiguracao(): ConfiguracaoSelenium {
    return {
      nome: '',
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
    };
  }
}
