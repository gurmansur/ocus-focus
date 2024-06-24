import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClickableCardComponent } from '../../../shared/clickable-card/clickable-card.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { TableComponent } from '../../../shared/table/table.component';
import { ExecutionIconComponent } from './components/execution-icon/execution-icon.component';
import { TestCaseIconComponent } from './components/test-case-icon/test-case-icon.component';
import { TestPlanIconComponent } from './components/test-plan-icon/test-plan-icon.component';
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
  ],
})
export class PainelArcatestComponent {
  projectId!: number;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
  }

  navigateToTestExecutions() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'execucoes-teste',
    ]);
  }

  navigateToTestCases() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'casos-teste',
    ]);
  }

  navigateToTestPlans() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'planos-teste',
    ]);
  }

  navigateToTestSuites() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'suites-teste',
    ]);
  }

  navigateToHome() {
    this.router.navigate(['/dashboard/projeto/', this.projectId]);
  }
}
