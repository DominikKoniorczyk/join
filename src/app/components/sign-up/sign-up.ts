import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss']
})
export class SignUp {

  constructor(private router: Router) {} 

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptPolicy: boolean = false;

  showPasswordError: boolean = false;
  submitted: boolean = false;

  onSubmit(form: any) {
    this.submitted = true;

    if (!this.acceptPolicy) return;

    if (this.password !== this.confirmPassword) {
      this.showPasswordError = true;
      return;
    } else {
      this.showPasswordError = false;
    }

    if (form.valid) {
      console.log('User registered:', {
        name: this.name,
        email: this.email,
        password: this.password
      });

      
      this.router.navigate(['/summary']);//wo muss es führen ? summary geht oder 
    }
  }
}