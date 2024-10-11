import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ContentModalComponent } from '../../../shared/content-modal/content-modal.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { SuiteDeTeste } from '../../models/suiteDeTeste';
import { SuiteDeTesteService } from '../../services/suiteDeTeste.service';
import { ArcatestFileComponent } from './arcatest-file/arcatest-file.component';

@Component({
  selector: 'app-arcatest-file-tree',
  standalone: true,
  imports: [
    ProjectHeaderComponent,
    ArcatestFileComponent,
    NgxChartsModule,
    ContentModalComponent,
    ModalComponent,
    PlusIconComponent,
    ButtonComponent,
  ],
  templateUrl: './arcatest-file-tree.component.html',
  styleUrl: './arcatest-file-tree.component.css',
})
export class ArcatestFileTreeComponent {
  fileTree: SuiteDeTeste[] = [];
  projectId!: number;
  legendPosition: LegendPosition = LegendPosition.Below;
  openDelete: boolean = false;
  openCoverage: boolean = false;

  constructor(
    @Inject(SuiteDeTesteService)
    private suiteDeTesteService: SuiteDeTesteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];

    this.suiteDeTesteService.getFileTree().subscribe((response) => {
      this.fileTree = response;
      console.log(this.fileTree);
    });
  }

  navigateToArcaTest() {
    this.router.navigate(['/dashboard/projeto/', this.projectId]);
  }

  closeDeleteModal() {
    this.openDelete = false;
  }

  deleteExecution() {}

  openDeleteModal(id: number) {
    this.openDelete = true;
  }

  openCoverageModal() {
    this.openCoverage = true;
  }

  closeCoverageModal() {
    this.openCoverage = false;
  }
}
