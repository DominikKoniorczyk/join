import { Component } from '@angular/core';
import { Slider } from './slider/slider';
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
  imports: [ Slider, LogInHeader, LogInForm, LogInFooter, RouterLink],
  templateUrl: './log-in.html',
  styleUrls: ['./log-in.scss'],
})
export class LogIn {
  phase: Phase = 'splash';

  constructor(private auth: AuthService, private supabase: Supabase){}

  ngAfterViewInit(){
    this.auth.logout();
    this.supabase.logOut();
  }

  /**
   * Called when the splash animation is completed.
   * Transitions the component phase to the slide animation.
   */
  onSplashDone(): void {
    this.phase = 'slide';
  }

  /**
   * Called when the slide animation is completed.
   * Transitions the component phase to a stable state.
   */
  onSlideDone(): void {
    this.phase = 'stable';
  }
}
