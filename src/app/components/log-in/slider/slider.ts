import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
})
export class Slider implements OnInit {
  @Output() done = new EventEmitter<void>();

  ngOnInit(): void {
    setTimeout(() => this.done.emit(), 1000); // 1000ms bis Log In Fenster sichtbar wird.
  }
}
