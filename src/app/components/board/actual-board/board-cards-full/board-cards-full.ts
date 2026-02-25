import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-board-cards-full',
  imports: [],
  templateUrl: './board-cards-full.html',
  styleUrl: './board-cards-full.scss',
})
export class BoardCardsFull {
isChecked = signal(false);

@Output() closeTriggered = new EventEmitter<void>();

toggleCheck() {
    this.isChecked.update(value => !value);
  }

onClose(){
  this.closeTriggered.emit();
}
}
