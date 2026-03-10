import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Supabase } from '../../../services/supabase';

@Component({
  selector: 'app-log-in-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './log-in-form.html',
  styleUrls: ['./log-in-form.scss'],
})
export class LogInForm {
  password = '';
  showPassword = false;

  logInGroup!: FormGroup;
  emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$';
  invalid = signal<boolean>(false);

  constructor(private router: Router, private supaBase: Supabase, private auth: AuthService) {
        this.logInGroup = new FormGroup (
      {
        email: new FormControl('', {validators:[Validators.required, Validators.pattern(this.emailPattern)]}) ,
        password: new FormControl('', {validators:[Validators.required, Validators.minLength(6)]}) ,
      })
    ;
  }

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

  async onSubmit(){
    const { data, error } = await this.supaBase.signInUser(this.logInGroup.get('email')?.value, this.logInGroup.get('password')?.value);
    if(!error){
      this.router.navigateByUrl('/summary');
      this.invalid.set(false);
    }
    if(error){
      this.invalid.set(true);
    }
  }
}
