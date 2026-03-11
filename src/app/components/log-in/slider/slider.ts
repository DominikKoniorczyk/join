import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
})
export class Slider implements OnInit {
  @Output() done = new EventEmitter<void>();

  /**
   * Angular lifecycle hook that runs after the component has been initialized.
   * Emits the `done` event after a 1000ms delay, allowing a login window
   * or similar UI element to become visible.
   */
  ngOnInit(): void {
    setTimeout(() => this.done.emit(), 1000); // 1000ms bis Log In Fenster sichtbar wird.
  }
}
