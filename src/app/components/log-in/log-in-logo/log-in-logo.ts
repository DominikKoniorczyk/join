import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-log-in-logo',
  standalone: true,
  templateUrl: './log-in-logo.html',
  styleUrls: ['./log-in-logo.scss'],
})
export class LogInLogo implements OnInit {
  @Input() mode: 'splash' | 'stable' = 'splash';
  @Output() done = new EventEmitter<void>();

  /**
   * Angular lifecycle hook that runs after component initialization.
   * In "splash" mode, waits 1 second before emitting the `done` event.
   */
  ngOnInit(): void {
    if (this.mode === 'splash') {
      setTimeout(() => this.done.emit(), 1000);
    }
  }
}
