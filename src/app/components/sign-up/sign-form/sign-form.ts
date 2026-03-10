import { SupabaseClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn, ValueChangeEvent } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../../services/supabase';


@Component({
  selector: 'app-sign-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-form.html',
  styleUrls: ['./sign-form.scss'],
})
export class SignForm {

  signUpForm!: FormGroup;

  showPassword = false;
  showConfirmPassword = false;
  showSuccess = false;

  namePattern = '^[A-Za-zÄÖÜäöüß]+\\s+[A-Za-zÄÖÜäöüß]+(\\s*[A-Za-zÄÖÜäöüß]*)*$';
  emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$';

  constructor(private fb: FormBuilder, private router: Router, private supabase: Supabase) {
    this.signUpForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.pattern(this.namePattern)]],
        email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        acceptPolicy: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator() }
    );
  }

  get policyAccepted(): boolean {
    return this.signUpForm.get('acceptPolicy')?.value;
  }

  get passwordMismatch(): boolean {
    const ctrl = this.signUpForm.get('confirmPassword');
    return !!(
      ctrl &&
      (ctrl.touched || ctrl.dirty) &&
      this.signUpForm.hasError('passwordMismatch')
    );
  }

  togglePolicy(): void {
    const ctrl = this.signUpForm.get('acceptPolicy');
    ctrl?.setValue(!ctrl.value);
    ctrl?.markAsTouched();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordIcon(): string {
    const password = this.signUpForm.get('password')?.value;

    if (!password) return 'assets/img/password-lock-icon.png';

    return this.showPassword
      ? 'assets/img/visibility-on-icon.png'
      : 'assets/img/visibility-off-icon.png';
  }

  getConfirmPasswordIcon(): string {
    const confirm = this.signUpForm.get('confirmPassword')?.value;

    if (!confirm) return 'assets/img/password-lock-icon.png';

    return this.showConfirmPassword
      ? 'assets/img/visibility-on-icon.png'
      : 'assets/img/visibility-off-icon.png';
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.signUpForm.get(controlName);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty));
  }

  hasError(controlName: string, errorKey: string): boolean {
    const ctrl = this.signUpForm.get(controlName);
    return !!(
      ctrl &&
      ctrl.hasError(errorKey) &&
      (ctrl.touched || ctrl.dirty)
    );
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.showSuccess = true;

    this.supabase.signUpUser(this.signUpForm.get('name')?.value, this.signUpForm.get('email')?.value, this.signUpForm.get('password')?.value)

    setTimeout(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    }, 1000);
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      if (!password || !confirmPassword) return null;

      return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
  }
}
