import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-board-cards-full',
  imports: [],
  templateUrl: './board-cards-full.html',
  styleUrl: './board-cards-full.scss',
})
export class BoardCardsFull {
isChecked = signal(false);

toggleCheck() {
    this.isChecked.update(value => !value);
  }
}
