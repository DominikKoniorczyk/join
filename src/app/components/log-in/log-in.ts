import { Component } from '@angular/core';
import { LogInHeader } from './log-in-header/log-in-header';
import { LogInForm } from './log-in-form/log-in-form';
import { LogInFooter } from './log-in-footer/log-in-footer';
import { AuthService } from '../../services/auth.service';
import { Supabase } from '../../services/supabase';
import { RouterLink } from '@angular/router';

type Phase = 'splash' | 'slide' | 'stable';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [  LogInHeader, LogInForm, LogInFooter, RouterLink],
  templateUrl: './log-in.html',
  styleUrls: ['./log-in.scss'],
})
export class LogIn {
  phase: Phase = 'splash';

  constructor(private auth: AuthService, private supabase: Supabase){}

  /**
   * Angular method after view init. Automatically log out on loading.
   */
   ngAfterViewInit(){
    this.auth.logout();
    this.supabase.logOut();
  }
}
