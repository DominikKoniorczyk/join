import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../../services/supabase';
import { passwordMatchValidator } from '../../../services/custom-validators';

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
      { validators: passwordMatchValidator() }
    );
  }

  /**
   * Returns whether the user has accepted the policy checkbox.
   */
  get policyAccepted(): boolean {
    return this.signUpForm.get('acceptPolicy')?.value;
  }

  /**
   * Checks whether the password and confirm password fields do not match
   * and if the confirm password field has been touched or modified.
   */
  get passwordMismatch(): boolean {
    const ctrl = this.signUpForm.get('confirmPassword');
    return !!(
      ctrl &&
      (ctrl.touched || ctrl.dirty) &&
      this.signUpForm.hasError('passwordMismatch')
    );
  }

  /**
   * Toggles the policy acceptance checkbox and marks it as touched.
   */
  togglePolicy(): void {
    const ctrl = this.signUpForm.get('acceptPolicy');
    ctrl?.setValue(!ctrl.value);
    ctrl?.markAsTouched();
  }

  /**
   * Toggles visibility of the password field.
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggles visibility of the confirm password field.
   */
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Returns the correct icon path for the password field
   * depending on whether the password is shown or hidden.
   *
   * @returns {string} Path to the password icon image.
   */
  getPasswordIcon(): string {
    const password = this.signUpForm.get('password')?.value;

    if (!password) return 'assets/img/password-lock-icon.png';

    return this.showPassword
      ? 'assets/img/visibility-on-icon.png'
      : 'assets/img/visibility-off-icon.png';
  }

  /**
   * Returns the correct icon path for the confirm password field
   * depending on whether the confirm password is shown or hidden.
   *
   * @returns {string} Path to the confirm password icon image.
   */
  getConfirmPasswordIcon(): string {
    const confirm = this.signUpForm.get('confirmPassword')?.value;

    if (!confirm) return 'assets/img/password-lock-icon.png';

    return this.showConfirmPassword
      ? 'assets/img/visibility-on-icon.png'
      : 'assets/img/visibility-off-icon.png';
  }

  /**
   * Checks whether a form control is invalid and has been touched or modified.
   *
   * @param {string} controlName - The name of the form control.
   * @returns {boolean} True if the control is invalid, false otherwise.
   */
  isInvalid(controlName: string): boolean {
    const ctrl = this.signUpForm.get(controlName);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty));
  }

  /**
   * Checks whether a form control has a specific validation error
   * and has been touched or modified.
   *
   * @param {string} controlName - The name of the form control.
   * @param {string} errorKey - The validation error key to check for.
   * @returns {boolean} True if the error exists, false otherwise.
   */
  hasError(controlName: string, errorKey: string): boolean {
    const ctrl = this.signUpForm.get(controlName);
    return !!(
      ctrl &&
      ctrl.hasError(errorKey) &&
      (ctrl.touched || ctrl.dirty)
    );
  }

  /**
   * Handles form submission.
   * Validates the form, triggers Supabase sign-up, shows success message,
   * and navigates to the login page after a delay.
   */
  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.showSuccess = true;
    this.supabase.signUpUser(this.signUpForm.get('name')?.value, this.signUpForm.get('email')?.value, this.signUpForm.get('password')?.value);
    setTimeout(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    }, 1000);
  }
}
