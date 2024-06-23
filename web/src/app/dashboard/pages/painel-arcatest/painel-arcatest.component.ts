import { Component } from '@angular/core';
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
  navigateTo(url: string) {
    console.log('navigating to', url);

    window.location.href = url;
  }

  navigateToTestExecution() {
    this.navigateTo('/test-execution');
  }

  navigateToTestCases() {
    this.navigateTo('/test-cases');
  }

  navigateToTestPlans() {
    this.navigateTo('/test-plans');
  }

  navigateToTestSuites() {
    this.navigateTo('/test-suites');
  }
}
