import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-form.html',
  styleUrls: ['./sign-form.scss'],
})

export class SignForm {
  constructor(private router: Router) {}

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  acceptPolicy = false;

  showPassword = false;
  showConfirmPassword = false;

  showSuccess = false;

  namePattern = '^[A-Za-zÄÖÜäöüß]+\\s+[A-Za-zÄÖÜäöüß]+(\\s*[A-Za-zÄÖÜäöüß]*)*$';
  emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$';

  togglePolicy(): void {
    this.acceptPolicy = !this.acceptPolicy;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordIcon(): string {
    if (!this.password) return 'assets/img/password-lock-icon.png';
    return this.showPassword
      ? 'assets/img/visibility-on-icon.png'
      : 'assets/img/visibility-off-icon.png';
  }

  getConfirmPasswordIcon(): string {
    if (!this.confirmPassword) return 'assets/img/password-lock-icon.png';
    return this.showConfirmPassword
      ? 'assets/img/visibility-on-icon.png'
      : 'assets/img/visibility-off-icon.png';
  }

  showError(f: NgForm, ctrl: NgModel): boolean {
    return (ctrl.touched || f.submitted) && !!ctrl.invalid;
  }

  canSubmit(f: NgForm): boolean {
    return !!f.valid && this.acceptPolicy && this.password === this.confirmPassword;
  }

  onSubmit(f: NgForm): void {
    if (!this.canSubmit(f)) return;

    this.showSuccess = true;

    setTimeout(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    }, 1000);
  }
}
