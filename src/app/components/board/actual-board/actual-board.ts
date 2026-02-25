import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCardsComponent } from './board-cards/board-cards';
import { BoardCardsFull } from './board-cards-full/board-cards-full';
import { Dialog } from '@angular/cdk/dialog';
import { AnimationService } from '../../../services/animation.service';
import { slideInAnimations, slideOutAnimations } from '../animations-board/dialog.animation';

@Component({
  selector: 'app-actual-board',
  standalone: true,
  imports: [CommonModule, BoardCardsComponent, BoardCardsFull],
  templateUrl: './actual-board.html',
  styleUrl: './actual-board.scss',
})
export class ActualBoard {

  animService = inject(AnimationService);

  @ViewChild('cardDialog') cardDetails! : ElementRef;


  async openDialog(){
    const dialogRef = this.cardDetails.nativeElement;
    dialogRef.showModal();
    await this.animService.animate(dialogRef, slideInAnimations, 400, true)
  }

  async closeDialog(){
    const dialogRef = this.cardDetails.nativeElement;
    await this.animService.animate(dialogRef, slideOutAnimations, 300, true)
    dialogRef.close();
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
