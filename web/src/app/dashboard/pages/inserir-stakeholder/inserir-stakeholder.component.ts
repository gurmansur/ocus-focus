import { Component, OnInit } from '@angular/core';
import { StakeholderService } from '../../services/stakeholder.service';
import { StakeholderSignup } from '../../models/stakeholderSignup';
import { Projeto } from '../../models/projeto';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetoService } from '../../services/projeto.service';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-inserir-stakeholder',
  templateUrl: './inserir-stakeholder.component.html',
  styleUrls: ['./inserir-stakeholder.component.css']
})
export class InserirStakeholderComponent implements OnInit {
  projetoId!: number;
  projeto!: Projeto;
  userId: number = 0;
  stakeholderFormGroup!: FormGroup;
  errorMessage: string = '';

  constructor(
    private stakeholderService: StakeholderService,
    private projetoService: ProjetoService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.projetoId = this.route.snapshot.params['id'];
    
    // Get user ID from AuthService or StorageService as fallback
    const userData = this.authService.getUserData();
    if (userData && userData.id) {
      this.userId = Number(userData.id);
    } else {
      // Fallback to StorageService
      const storedId = this.storageService.getItem('usu_id');
      this.userId = storedId ? Number(storedId) : 0;
    }
  }

  ngOnInit(): void {
    if (this.userId === 0) {
      console.error('ID de usuário não encontrado');
      this.router.navigate(['/']);
      return;
    }
    
    this.stakeholderFormGroup = this.formBuilder.group({
      nome: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),

      email: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ]),

      cargo: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),

      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),

      confirmarSenha: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
    });

    this.buscarProjeto(this.projetoId, this.userId);
  }

  buscarProjeto(id: number, user: number) {
    this.projetoService.findById(id, user).subscribe({
      next: (projeto) => {
        this.projeto = projeto;
      },
      error: (err) => {
        console.error('Erro ao buscar projeto:', err);
      }
    });
  }

  backToPrioreasy(): void {
    this.router.navigate(['/dashboard/projeto/', this.projetoId, 'painel-prioreasy']);
  }

  get nome() {
    return this.stakeholderFormGroup.get('nome');
  }
  get email() {
    return this.stakeholderFormGroup.get('email');
  }
  get cargo() {
    return this.stakeholderFormGroup.get('cargo');
  }
  get senha() {
    return this.stakeholderFormGroup.get('senha');
  }
  get confirmarSenha() {
    return this.stakeholderFormGroup.get('confirmarSenha');
  }

  private createStakeholder(): StakeholderSignup {
    return new StakeholderSignup(
      this.nome!.value,
      this.email!.value,
      this.cargo!.value,
      this.senha!.value,
      this.confirmarSenha!.value,
      this.projetoId
    );
  }

  onSubmit(): void {
    if (this.stakeholderFormGroup.invalid) {
      this.stakeholderFormGroup.markAllAsTouched();
      return;
    } else {
      this.errorMessage = '';
      const signupStakeholder = this.createStakeholder();

      this.stakeholderService.create(signupStakeholder).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/projeto/', this.projetoId, 'stakeholders']);
        },
        error: (err) => {
          console.error('Erro ao criar stakeholder:', err);
          this.errorMessage = err.error?.message || 'Erro ao criar stakeholder. Verifique os dados.';
        },
      });
    }
  }
}
