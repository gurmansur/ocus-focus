import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContentModalComponent } from 'src/app/shared/content-modal/content-modal.component';

@Component({
  selector: 'app-flyingcards-configure-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ContentModalComponent],
  templateUrl: './flyingcards-configure-modal.component.html',
  styleUrl: './flyingcards-configure-modal.component.css',
})
export class FlyingcardsConfigureModalComponent {
  configureFormGroup: any;
  formBuilder: FormBuilder = new FormBuilder();
  @Input({ required: true }) open: boolean = false;
  @Input() configs: string[] = [];
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  ngOnInit(): void {
    this.configureFormGroup = this.formBuilder.group({
      tempo: new FormControl('', Validators.required),
      maximo: new FormControl('', Validators.required),
    });
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
