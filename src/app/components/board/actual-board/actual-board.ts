import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCardsComponent } from './board-cards/board-cards';

@Component({
  selector: 'app-actual-board',
  standalone: true,
  imports: [CommonModule, BoardCardsComponent],
  templateUrl: './actual-board.html',
  styleUrl: './actual-board.scss',
})
export class ActualBoard {

  // @Input() task: any;

  // open = false;

  // openTask() {
  //   this.open = true;
  // }

  // closeTask() {
  //   this.open = false;
  // }
}
