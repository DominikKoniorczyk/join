import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-log-in-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './log-in-form.html',
  styleUrls: ['./log-in-form.scss'],
})
export class LogInForm {
  password = '';
  showPassword = false;

  constructor(private router: Router, private auth: AuthService) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  getPasswordIcon() {
    if (!this.password) return 'assets/img/password-lock-icon.png';
    return this.showPassword
      ? 'assets/img/visibility-on-icon.png'
      : 'assets/img/visibility-off-icon.png';
  }

  loginAsGuest() {
    this.auth.loginAsGuest();
    this.router.navigate(['/summary']);
  }
}