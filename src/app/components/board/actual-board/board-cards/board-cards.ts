import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ShortenTextsnippetsPipe } from '../../../../pipes/shorten-textsnippets-pipe';

@Component({
  selector: 'app-board-cards',
  standalone: true,
  imports: [DragDropModule, ShortenTextsnippetsPipe], // 🔥 DAS IST DER FIX
  templateUrl: './board-cards.html',
  styleUrls: ['./board-cards.scss']
})
export class BoardCardsComponent {}
