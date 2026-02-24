import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-cards',
  standalone: true,
  imports: [DragDropModule], // 🔥 DAS IST DER FIX
  templateUrl: './board-cards.html',
  styleUrls: ['./board-cards.scss']
})
export class BoardCardsComponent {}