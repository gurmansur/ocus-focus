import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExecutarTeste } from 'src/app/dashboard/models/executarTeste';
import { ContentModalComponent } from '../../../../../shared/content-modal/content-modal.component';

@Component({
  selector: 'app-arcatest-execucoes-modal',
  standalone: true,
  imports: [
    ContentModalComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './arcatest-execucoes-modal.component.html',
  styleUrl: './arcatest-execucoes-modal.component.css',
})
export class ArcatestExecucoesModalComponent {
  executarFormGroup: any;
  formBuilder: FormBuilder = new FormBuilder();
  @Input({ required: true }) open: boolean = false;
  @Input() value!: ExecutarTeste;
  @Output() valueChange = new EventEmitter<ExecutarTeste>();
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();

  ngOnInit(): void {
    this.executarFormGroup = this.formBuilder.group({
      status: new FormControl(this.value?.resultado || '', Validators.required),
      observacoes: new FormControl(
        this.value?.observacao || '',
        Validators.required,
      ),
    });
  }

  onConfirm() {
    this.confirm.emit(this.value?.id);
  }

  onCancel() {
    this.cancel.emit();
  }

  onValueChange() {
    const value = new ExecutarTeste(
      this.value.id,
      this.status.value,
      this.observacoes.value,
    );
    this.valueChange.emit(value);
  }

  stopPropagation($event: MouseEvent) {
    $event.stopPropagation();
  }

  get observacoes() {
    return this.executarFormGroup.get('observacoes');
  }

  get status() {
    return this.executarFormGroup.get('status');
  }

  get isReprovado() {
    return this.status?.value === 'FALHA';
  }
}
