import { Component } from '@angular/core';
import { LogInLogo } from '../log-in/log-in-logo/log-in-logo';
import { LogInFooter } from '../log-in/log-in-footer/log-in-footer';
import { SignForm } from './sign-form/sign-form';

@Component({
  selector: 'app-sign-up',
  imports: [LogInLogo, LogInFooter, SignForm],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss'],
})
export class SignUp {}