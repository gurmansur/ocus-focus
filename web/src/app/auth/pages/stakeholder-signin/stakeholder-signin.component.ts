import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { StakeholderSignin } from '../../models/stakeholder-signin';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-stakeholder-signin',
  templateUrl: './stakeholder-signin.component.html',
  styleUrls: ['./stakeholder-signin.component.css'],
})
export class StakeholderSigninComponent {
  signinFormGroup!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.signinFormGroup = this.formBuilder.group({
      chave: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),

      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
    });
  }

  get chave() {
    return this.signinFormGroup.get('chave');
  }
  get senha() {
    return this.signinFormGroup.get('senha');
  }

  private createUser(): StakeholderSignin {
    return new StakeholderSignin(this.chave!.value, this.senha!.value);
  }

  onSubmit(): void {
    if (this.signinFormGroup.invalid) {
      this.signinFormGroup.markAllAsTouched();
      return;
    } else {
      this.isLoading = true;
      this.errorMessage = '';
      
      const signinUser = this.createUser();

      this.authService.signinStakeholder(signinUser)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (response) => {
            try {
              this.router.navigateByUrl('/dashboard')
                .then(() => console.log('Navigation to dashboard successful'))
                .catch(navError => {
                  console.error('Erro ao navegar para o dashboard:', navError);
                  this.errorMessage = 'Erro ao redirecionar para o dashboard.';
                });
            } catch (error) {
              console.error('Erro durante o processo de navegação:', error);
              this.errorMessage = 'Erro ao processar o login. Tente novamente.';
            }
          },
          error: (err) => {
            console.error('Erro de login:', err);
            this.errorMessage = err.error?.message || 'Erro ao realizar login. Verifique suas credenciais.';
          },
        });
    }
  }
}
