import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-form.html',
  styleUrls: ['./sign-form.scss'],
})
  
export class SignForm {
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  acceptPolicy = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordIcon() {
    if (!this.password) return 'assets/img/password-lock-icon.png';
    return this.showPassword
      ? 'assets/img/visibility-on-icon.png'
      : 'assets/img/visibility-off-icon.png';
  }

  getConfirmPasswordIcon() {
    if (!this.confirmPassword) return 'assets/img/password-lock-icon.png';
    return this.showConfirmPassword
      ? 'assets/img/visibility-on-icon.png'
      : 'assets/img/visibility-off-icon.png';
  }

  togglePolicy() {
    this.acceptPolicy = !this.acceptPolicy;
  }

  onSubmit() {
    console.log('Sign up clicked');
  }
};