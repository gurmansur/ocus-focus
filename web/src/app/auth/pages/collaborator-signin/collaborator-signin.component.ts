import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ColaboradorSignin } from '../../models/colaborador-signin';
import { AuthService } from '../../services/auth.service';

/**
 * Collaborator sign-in component
 * Handles login form and authentication
 * Follows Smart component pattern (handles business logic and component communication)
 */
@Component({
  selector: 'app-collaborator-signin',
  templateUrl: './collaborator-signin.component.html',
  styleUrls: ['./collaborator-signin.component.css'],
})
export class CollaboratorSigninComponent implements OnInit {
  signinFormGroup!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the login form with validation
   */
  private initializeForm(): void {
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

  /**
   * Get email form control
   */
  get email() {
    return this.signinFormGroup.get('email');
  }

  /**
   * Get password form control
   */
  get senha() {
    return this.signinFormGroup.get('senha');
  }

  /**
   * Create login user object from form values
   * @returns ColaboradorSignin object
   */
  private createUser(): ColaboradorSignin {
    return new ColaboradorSignin(this.email!.value, this.senha!.value);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.errorMessage = null;

    if (this.signinFormGroup.invalid) {
      this.signinFormGroup.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const signinUser = this.createUser();

    this.authService.signinColaborador(signinUser).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || 'An error occurred during sign in';
        console.error('Sign in error:', err);
      },
    });
  }
}
