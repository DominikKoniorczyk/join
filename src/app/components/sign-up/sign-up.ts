import { Component } from '@angular/core';
import { LogInFooter } from '../log-in/log-in-footer/log-in-footer';
import { SignForm } from './sign-form/sign-form';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ LogInFooter, SignForm],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss'],
})
export class SignUp {}
