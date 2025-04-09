import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ColaboradorSignin } from '../../models/colaborador-signin';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-collaborator-signin',
  templateUrl: './collaborator-signin.component.html',
  styleUrls: ['./collaborator-signin.component.css'],
})
export class CollaboratorSigninComponent implements OnInit {
  signinFormGroup!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  /**
   * Inicializa o formulário de login com validações
   */
  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa o formulário com as validações necessárias
   */
  private initializeForm(): void {
    this.signinFormGroup = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),

      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
    });
  }

  /**
   * Getter para o campo de email do formulário
   */
  get email() {
    return this.signinFormGroup.get('email');
  }

  /**
   * Getter para o campo de senha do formulário
   */
  get senha() {
    return this.signinFormGroup.get('senha');
  }

  /**
   * Cria um objeto de login a partir dos valores do formulário
   */
  private createUser(): ColaboradorSignin {
    return new ColaboradorSignin(this.email!.value, this.senha!.value);
  }

  /**
   * Processa o envio do formulário de login
   */
  onSubmit(): void {
    if (this.signinFormGroup.invalid) {
      this.signinFormGroup.markAllAsTouched();
      return;
    }

    this.login();
  }

  /**
   * Realiza o processo de login
   */
  private login(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const signinUser = this.createUser();

    this.authService
      .signinColaborador(signinUser)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          try {
            // Use navigateByUrl which can be more reliable than navigate in some cases
            this.router
              .navigateByUrl('/dashboard')
              .then(() => console.log('Navigation to dashboard successful'))
              .catch((navError) => {
                console.error('Erro ao navegar para o dashboard:', navError);
                this.errorMessage = 'Erro ao redirecionar para o dashboard.';
              });
          } catch (error) {
            console.error('Erro durante o processo de navegação:', error);
            this.errorMessage = 'Erro ao processar o login. Tente novamente.';
          }
        },
        error: (err) => {
          console.error('Erro no login de colaborador:', err);
          this.errorMessage =
            err.error?.message ||
            'Erro ao realizar login. Verifique suas credenciais.';
          this.isLoading = false;
        },
      });
  }
}
