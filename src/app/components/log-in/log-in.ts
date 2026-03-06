import { Component } from '@angular/core';
import { LogInLogo } from './log-in-logo/log-in-logo';
import { Slider } from './slider/slider';
import { LogInHeader } from './log-in-header/log-in-header';
import { LogInForm } from './log-in-form/log-in-form';
import { LogInFooter } from './log-in-footer/log-in-footer';

type Phase = 'splash' | 'slide' | 'stable';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [LogInLogo, Slider, LogInHeader, LogInForm, LogInFooter],
  templateUrl: './log-in.html',
  styleUrls: ['./log-in.scss'],
})
export class LogIn {
  phase: Phase = 'splash';

  onSplashDone(): void {
    this.phase = 'slide';
  }

  onSlideDone(): void {
    this.phase = 'stable';
  }
}
