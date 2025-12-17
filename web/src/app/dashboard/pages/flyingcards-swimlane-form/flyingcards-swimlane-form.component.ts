import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { Swimlane } from '../../models/swimlane';
import { KanbanService } from '../../services/kanban.service';

@Component({
  selector: 'app-flyingcards-swimlane-form',
  standalone: true,
  imports: [
    ProjectHeaderComponent,
    ButtonComponent,
    PlusIconComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './flyingcards-swimlane-form.component.html',
  styleUrl: './flyingcards-swimlane-form.component.css',
})
export class FlyingcardsSwimlaneFormComponent {
  swimlaneFormGroup: any;
  swimlane: Swimlane = new Swimlane();

  isEdit: boolean = false;
  swimlaneId: number = -1;

  private projectId: number;
  private kanbanId: number = -1;
  formBuilder: FormBuilder = new FormBuilder();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private kanbanService: KanbanService,
  ) {
    this.projectId = parseInt(this.route.snapshot.params['id']);
    this.isEdit = this.route.snapshot.params['swimlaneId'] ? true : false;
    if (this.isEdit)
      this.swimlaneId = parseInt(this.route.snapshot.params['swimlaneId']);
  }

  ngOnInit() {
    this.kanbanService.getKanbanId(this.projectId).subscribe((kanban) => {
      this.kanbanId = kanban;
    });

    if (this.isEdit) {
      this.kanbanService.findSwimlane(this.swimlaneId).subscribe((swimlane) => {
        console.log(swimlane);
        this.swimlaneFormGroup.patchValue(swimlane);
      });
    }

    this.swimlaneFormGroup = this.formBuilder.group({
      nome: new FormControl<string>(
        this.swimlane?.nome || '',
        Validators.required,
      ),
      cor: new FormControl<string>(
        this.swimlane.cor || '#6d28d9',
        Validators.required,
      ),
    });
  }

  navigateToKanban() {
    this.router.navigate(['/dashboard/projeto/', this.projectId, 'kanban']);
  }

  handleSwimlane() {
    if (!this.isEdit) {
      this.kanbanService
        .createSwimlane({
          ...this.swimlaneFormGroup.value,
          kanban: this.kanbanId,
        })
        .subscribe({
          next: () => this.navigateToKanban(),
        });
    } else {
      console.log({ ...this.swimlaneFormGroup.value });

      this.kanbanService
        .updateSwimlane(this.swimlaneId, {
          ...this.swimlaneFormGroup.value,
          kanban: this.kanbanId,
        })
        .subscribe({
          next: () => this.navigateToKanban(),
        });
    }
  }

  deletarSwimlane() {
    this.kanbanService.deleteSwimlane(this.swimlaneId).subscribe({
      next: () => this.navigateToKanban(),
    });
  }
}
