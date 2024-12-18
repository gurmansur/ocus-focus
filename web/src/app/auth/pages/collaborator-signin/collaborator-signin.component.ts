import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ColaboradorSignin } from '../../models/colaborador-signin';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-collaborator-signin',
  templateUrl: './collaborator-signin.component.html',
  styleUrls: ['./collaborator-signin.component.css'],
})
export class CollaboratorSigninComponent {
  signinFormGroup!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.signinFormGroup = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
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

  get email() {
    return this.signinFormGroup.get('email');
  }
  get senha() {
    return this.signinFormGroup.get('senha');
  }

  private createUser(): ColaboradorSignin {
    return new ColaboradorSignin(this.email!.value, this.senha!.value);
  }

  onSubmit(): void {
    if (this.signinFormGroup.invalid) {
      this.signinFormGroup.markAllAsTouched();
      return;
    } else {
      const signinUser = this.createUser();

      this.authService.signinColaborador(signinUser).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('usu_email', response.usu_email);
          localStorage.setItem('usu_name', response.usu_name);
          localStorage.setItem('usu_id', response.usu_id.toString());
          localStorage.setItem('usu_role', response.usu_role);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert(err.error.message);
        },
      });
    }
  }
}
