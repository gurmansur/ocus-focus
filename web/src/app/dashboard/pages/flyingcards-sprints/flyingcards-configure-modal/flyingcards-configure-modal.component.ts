import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { ContentModalComponent } from 'src/app/shared/content-modal/content-modal.component';
import { Sprint } from '../../../models/sprint';

@Component({
  selector: 'app-flyingcards-configure-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContentModalComponent,
    ButtonComponent,
  ],
  templateUrl: './flyingcards-configure-modal.component.html',
  styleUrl: './flyingcards-configure-modal.component.css',
})
export class FlyingcardsConfigureModalComponent implements OnInit {
  configureFormGroup!: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();

  @Input({ required: true }) open: boolean = false;
  @Input() sprints: Sprint[] = [];
  @Input() activeSprint: Sprint | null = null;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Sprint>();
  @Output() delete = new EventEmitter<number>();
  @Output() selectSprint = new EventEmitter<Sprint>();
  @Output() createNew = new EventEmitter<void>();

  mode: 'list' | 'create' | 'edit' = 'list';
  selectedSprintId: number | null = null;

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(): void {
    if (this.mode === 'edit' && this.selectedSprintId && this.activeSprint) {
      this.populateForm(this.activeSprint);
    }
  }

  initializeForm(): void {
    this.configureFormGroup = this.formBuilder.group({
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      descricao: new FormControl('', Validators.required),
      horas_previstas: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      data_inicio: new FormControl('', Validators.required),
      data_fim: new FormControl('', Validators.required),
    });
  }

  populateForm(sprint: Sprint): void {
    this.configureFormGroup.patchValue({
      nome: sprint.nome,
      descricao: sprint.descricao,
      horas_previstas: sprint.horas_previstas,
      data_inicio: sprint.data_inicio
        ? this.formatDate(sprint.data_inicio)
        : '',
      data_fim: sprint.data_fim ? this.formatDate(sprint.data_fim) : '',
    });
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onCreateNew(): void {
    this.mode = 'create';
    this.configureFormGroup.reset();
    this.initializeForm();
  }

  onEditSprint(sprint: Sprint): void {
    this.mode = 'edit';
    this.selectedSprintId = sprint.id || null;
    this.populateForm(sprint);
  }

  onSelectSprint(sprint: Sprint): void {
    this.selectSprint.emit(sprint);
    this.onCancel();
  }

  onDeleteSprint(sprintId: number | undefined): void {
    if (sprintId && confirm('Tem certeza que deseja deletar esta sprint?')) {
      this.delete.emit(sprintId);
    }
  }

  onConfirm(): void {
    if (!this.configureFormGroup) return;
    if (this.configureFormGroup.invalid) {
      this.configureFormGroup.markAllAsTouched();
      return;
    }

    const formValue = this.configureFormGroup.value;
    const sprint: Sprint = {
      ...formValue,
      id: this.mode === 'edit' ? this.selectedSprintId : undefined,
    };

    this.confirm.emit(sprint);
    this.mode = 'list';
    this.configureFormGroup.reset();
  }

  onCancel(): void {
    this.mode = 'list';
    this.configureFormGroup.reset();
    this.selectedSprintId = null;
    this.cancel.emit();
  }
}
