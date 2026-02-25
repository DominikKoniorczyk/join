import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCardsComponent } from './board-cards/board-cards';
import { BoardCardsFull } from './board-cards-full/board-cards-full';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-actual-board',
  standalone: true,
  imports: [CommonModule, BoardCardsComponent, BoardCardsFull],
  templateUrl: './actual-board.html',
  styleUrl: './actual-board.scss',
})
export class ActualBoard {

@ViewChild('cardDialog') cardDetails! : ElementRef;


  openDialog(){
    this.cardDetails?.nativeElement.showModal();
  }

  closeDialog(){
    this.cardDetails.nativeElement.close();
  }

  // @Input() task: any;

  // open = false;

  // openTask() {
  //   this.open = true;
  // }

  // closeTask() {
  //   this.open = false;
  // }
}
