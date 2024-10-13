import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { TreeDragDropService, TreeNode } from 'primeng/api';
import { TreeModule, TreeNodeDropEvent } from 'primeng/tree';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ContentModalComponent } from '../../../shared/content-modal/content-modal.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { CasoDeTeste } from '../../models/casoDeTeste';
import { FileTree } from '../../models/fileTree';
import { SuiteDeTeste } from '../../models/suiteDeTeste';
import { CasoDeTesteService } from '../../services/casoDeTeste.service';
import { SuiteDeTesteService } from '../../services/suiteDeTeste.service';
import { TestSuiteIconComponent } from '../painel-arcatest/components/test-suite-icon/test-suite-icon.component';
import { ArcatestCasoComponent } from './arcatest-caso/arcatest-caso.component';
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
    ArcatestCasoComponent,
    TestSuiteIconComponent,
    TreeModule,
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
  fileTreeNodes: TreeNode[] = [];

  constructor(
    @Inject(SuiteDeTesteService)
    private suiteDeTesteService: SuiteDeTesteService,
    private casoDeTesteService: CasoDeTesteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];

    this.suiteDeTesteService.getFileTree().subscribe((response) => {
      this.fileTree = response;
      this.fileTreeNodes = this.fileTreeToNodes(this.fileTree);
    });
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
    console.log(event);
    const target = event.originalEvent?.target as HTMLElement;
    if (event.dropNode?.type === 'suite' || target.tagName === 'LI') {
      event.accept && event.accept();

      console.log(target.tagName);

      if (event.dragNode?.type === 'suite') {
        this.suiteDeTesteService
          .changeSuite(
            event.dragNode?.data.id,
            target.tagName === 'LI' ? null : event.dropNode?.data.id
          )
          .subscribe();
      } else if (event.dragNode?.type === 'case') {
        this.casoDeTesteService
          .changeSuite(
            event.dragNode?.data.id,
            target.tagName === 'LI' ? null : event.dropNode?.data.id
          )
          .subscribe();
      }
    } else {
      return;
    }
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
