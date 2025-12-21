import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StakeholderSignin } from '../../models/stakeholder-signin';
import { AuthService } from '../../services/auth.service';

/**
 * Stakeholder sign-in component
 * Handles login form and authentication for stakeholders
 * Follows Smart component pattern (handles business logic and component communication)
 */
@Component({
  selector: 'app-stakeholder-signin',
  templateUrl: './stakeholder-signin.component.html',
  styleUrls: ['./stakeholder-signin.component.css'],
})
export class StakeholderSigninComponent implements OnInit {
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

  /**
   * Get chave form control
   */
  get chave() {
    return this.signinFormGroup.get('chave');
  }

  /**
   * Get password form control
   */
  get senha() {
    return this.signinFormGroup.get('senha');
  }

  /**
   * Create login user object from form values
   * @returns StakeholderSignin object
   */
  private createUser(): StakeholderSignin {
    return new StakeholderSignin(this.chave!.value, this.senha!.value);
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

    this.authService.signinStakeholder(signinUser).subscribe({
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
