import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import {
  ConfiguracaoSeleniumDto,
  ConfiguracaoSeleniumService,
} from '../../../shared/services/configuracao-selenium.service';

@Component({
  selector: 'app-configuracao-selenium-form',
  standalone: true,
  templateUrl: './configuracao-selenium-form.component.html',
  styleUrl: './configuracao-selenium-form.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    PlusIconComponent,
  ],
})
export class ConfiguracaoSeleniumFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  projetoId!: number;
  configuracaoId?: number;

  navegadores = [
    { label: 'Chrome', value: 'CHROME' },
    { label: 'Firefox', value: 'FIREFOX' },
    { label: 'Edge', value: 'EDGE' },
    { label: 'Safari', value: 'SAFARI' },
  ];

  resolucoes = [
    { label: '1920x1080 (Full HD)', value: '1920x1080' },
    { label: '1366x768', value: '1366x768' },
    { label: '1280x720 (HD)', value: '1280x720' },
    { label: '1440x900', value: '1440x900' },
    { label: '1600x900', value: '1600x900' },
    { label: '2560x1440 (2K)', value: '2560x1440' },
    { label: '3840x2160 (4K)', value: '3840x2160' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private configuracaoService: ConfiguracaoSeleniumService
  ) {}

  ngOnInit(): void {
    const projectParam =
      this.route.parent?.parent?.parent?.snapshot.params['id'] ??
      this.route.parent?.parent?.snapshot.params['id'] ??
      this.route.parent?.snapshot.params['id'] ??
      this.route.snapshot.params['id'];

    this.projetoId = Number(projectParam);

    const idParam = this.route.snapshot.params['configuracaoId'];
    this.configuracaoId = idParam ? Number(idParam) : undefined;
    this.isEdit = !!this.configuracaoId;

    this.form = this.buildForm();

    if (this.isEdit && this.configuracaoId) {
      this.loadConfiguracao(this.configuracaoId);
    }
  }

  buildForm(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      navegador: ['CHROME', Validators.required],
      resolucao: ['1920x1080'],
      timeoutPadrao: [30000, [Validators.required, Validators.min(0)]],
      timeoutImplicito: [10000, [Validators.required, Validators.min(0)]],
      timeoutCarregamentoPagina: [60000, [Validators.required, Validators.min(0)]],
      urlSeleniumGrid: [''],
      userAgent: [''],
      proxy: [''],
      headless: [false],
      maximizarJanela: [true],
      aceitarCertificadosSSL: [true],
      capturarScreenshots: [true],
      capturarLogs: [true],
      ativa: [true],
    });
  }

  loadConfiguracao(id: number): void {
    this.configuracaoService.getById(id).subscribe({
      next: (config) => {
        this.form.patchValue(config);
      },
      error: (error) => {
        console.error('Erro ao carregar configuração:', error);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ConfiguracaoSeleniumDto = {
      ...this.form.value,
      timeoutPadrao: Number(this.form.value.timeoutPadrao),
      timeoutImplicito: Number(this.form.value.timeoutImplicito),
      timeoutCarregamentoPagina: Number(
        this.form.value.timeoutCarregamentoPagina
      ),
    };

    const request$ =
      this.isEdit && this.configuracaoId
        ? this.configuracaoService.update(this.configuracaoId, payload)
        : this.configuracaoService.create(payload);

    request$.subscribe({
      next: () => this.navigateToList(),
      error: (error) => {
        console.error('Erro ao salvar configuração:', error);
      },
    });
  }

  navigateToList(): void {
    this.router.navigate([
      '/dashboard/projeto',
      this.projetoId,
      'painel-arcatest',
      'configuracao-selenium',
    ]);
  }

  get nome() {
    return this.form.get('nome');
  }

  get navegador() {
    return this.form.get('navegador');
  }

  get timeoutPadrao() {
    return this.form.get('timeoutPadrao');
  }

  get timeoutImplicito() {
    return this.form.get('timeoutImplicito');
  }

  get timeoutCarregamentoPagina() {
    return this.form.get('timeoutCarregamentoPagina');
  }

  get isFormValid() {
    return this.form.valid;
  }
}
