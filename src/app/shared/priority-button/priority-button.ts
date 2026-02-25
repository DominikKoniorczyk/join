import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-priority-button',
  imports: [],
  templateUrl: './priority-button.html',
  styleUrl: './priority-button.scss',
})
export class PriorityButton {
  @Input() active: boolean = false;
  @Input() type: number = 0;
}
