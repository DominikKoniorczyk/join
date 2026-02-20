import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardNavComponent } from './boardNav/board-nav';
import { ActualBoardComponent } from './actualBoard/actual-board';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, BoardNavComponent, ActualBoardComponent],
  templateUrl: './board.html'
})
export class BoardComponent {}