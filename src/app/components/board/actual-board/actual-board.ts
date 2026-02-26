import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCardsComponent } from './board-cards/board-cards';
import { BoardCardsFull } from './board-cards-full/board-cards-full';
import { Dialog } from '@angular/cdk/dialog';
import { AnimationService } from '../../../services/animation.service';
import { slideInAnimations, slideOutAnimations } from '../animations-board/dialog.animation';
import { Task } from '../../../interfaces/taskmodel.interfaces';
import { ContactsSelectorWithSearch } from '../../add-task/taskform/contacts-selector-with-search/contacts-selector-with-search';

@Component({
  selector: 'app-actual-board',
  standalone: true,
  imports: [CommonModule, BoardCardsComponent, BoardCardsFull],
  templateUrl: './actual-board.html',
  styleUrl: './actual-board.scss',
})
export class ActualBoard {
  @Input() searchTerm: string = '';
  @ViewChild('cardDialog') cardDetails!: ElementRef;

  animService = inject(AnimationService);

  selectedTask?: Task;
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  awaitFeedbackTasks: Task[] = [];
  doneTasks: Task[] = [];


  async openDialog(task: Task) {
    this.selectedTask = task;
    const dialogRef = this.cardDetails.nativeElement;
    dialogRef.showModal();
    await this.animService.animate(dialogRef, slideInAnimations, 400, true)
  }

  async closeDialog() {
    const dialogRef = this.cardDetails.nativeElement;
    await this.animService.animate(dialogRef, slideOutAnimations, 300, true)
    dialogRef.close();
  }

  dummyTask: Task = {
    id: 1,
    progressStatus: 'To do',
    category: 'User Story',
    headline: 'Kochwelt & Recipe Recommender',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum ut soluta aliquam deleniti maxime, in itaque est tempore possimus sed consectetur obcaecati et laudantium quia, exercitationem sint sapiente molestias temporibus.',
    dueDate: '10/05/2023',
    priority: 2,
    assignedTo: [],
    subtasks: [
      { id: 1, title: 'Implement Recipe Recommendation', isDone: true },
      { id: 2, title: 'Start Page Layout', isDone: false }
    ]
  };


}
