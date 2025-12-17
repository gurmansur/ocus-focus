import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClickableCardComponent } from '../../../shared/clickable-card/clickable-card.component';
import { GearIconComponent } from '../../../shared/icons/gear-icon/gear-icon.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { TableComponent } from '../../../shared/table/table.component';
import { ArcatestExecucoesComponent } from '../arcatest-execucoes/arcatest-execucoes.component';
import { ArcatestFileTreeComponent } from '../arcatest-file-tree/arcatest-file-tree.component';
import { ExecutionIconComponent } from './components/execution-icon/execution-icon.component';
import { TestCaseIconComponent } from './components/test-case-icon/test-case-icon.component';
import { TestPlanIconComponent } from './components/test-plan-icon/test-plan-icon.component';
import { TestSidebarItemComponent } from './components/test-sidebar-item/test-sidebar-item.component';
import { TestSuiteIconComponent } from './components/test-suite-icon/test-suite-icon.component';

@Component({
  selector: 'app-painel-arcatest',
  standalone: true,
  templateUrl: './painel-arcatest.component.html',
  styleUrl: './painel-arcatest.component.css',
  imports: [
    ProjectHeaderComponent,
    TableComponent,
    ClickableCardComponent,
    ExecutionIconComponent,
    TestCaseIconComponent,
    TestSuiteIconComponent,
    TestPlanIconComponent,
    TestSidebarItemComponent,
    ArcatestExecucoesComponent,
    ArcatestFileTreeComponent,
    GearIconComponent,
    RouterModule,
    CommonModule,
  ],
})
export class PainelArcatestComponent {
  projectId!: number;
  selectedTab: 'execucoes' | 'arvore' | 'configuracao' = 'execucoes';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.projectId = this.route.snapshot.params['id'];
    if (this.router.url.includes('arvore')) {
      this.selectedTab = 'arvore';
    } else if (this.router.url.includes('configuracao-selenium')) {
      this.selectedTab = 'configuracao';
    } else {
      this.selectedTab = 'execucoes';
    }
  }

  navigateToTestExecutions() {
    this.selectedTab = 'execucoes';
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
      'execucoes',
    ]);
  }

  navigateToTestTree() {
    this.selectedTab = 'arvore';
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
      'arvore',
    ]);
  }

  navigateToSeleniumConfig() {
    this.selectedTab = 'configuracao';
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
      'configuracao-selenium',
    ]);
  }

  navigateToHome() {
    this.router.navigate(['/dashboard/projeto/', this.projectId]);
  }
}
