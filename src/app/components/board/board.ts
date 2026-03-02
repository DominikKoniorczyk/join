import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActualBoard } from './actual-board/actual-board';
import { BoardNav } from './board-nav/board-nav';
import { TaskformComponent } from '../add-task/taskform/taskform';
import { AnimationService } from '../../services/animation.service';
import { slideInAnimations, slideOutAnimations } from './animations-board/dialog.animation';
// Test Update

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, BoardNav, ActualBoard, TaskformComponent],
  templateUrl: './board.html',
  styleUrls: ['./board.scss']
})
export class Board implements OnInit {
  @ViewChild('#addTaksDialog') addTask!: ElementRef;
  @ViewChild('cardData') cardData!: TaskformComponent;

  searchTerm: string = '';
  currentTaks: string = 'To do';

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applySearch();
  }

  todo: any[] = [];
  inprogress: any[] = [];
  await: any[] = [];
  done: any[] = [];

  private allTodo: any[] = [];
  private allInprogress: any[] = [];
  private allAwait: any[] = [];
  private allDone: any[] = [];

  selectedTask: any = null;
  isEditing: boolean = false;

  constructor(private animService: AnimationService) { }

  ngOnInit(): void {

  }

  applySearch() {
    const term = (this.searchTerm || '').toLowerCase().trim();

    if (!term) {
      this.todo = [...this.allTodo];
      this.inprogress = [...this.allInprogress];
      this.await = [...this.allAwait];
      this.done = [...this.allDone];
      return;
    }

    const matches = (t: any) =>
      (t.title || t.headline || '').toLowerCase().includes(term) ||
      (t.description || t.desc || '').toLowerCase().includes(term);

    this.todo = this.allTodo.filter(matches);
    this.inprogress = this.allInprogress.filter(matches);
    this.await = this.allAwait.filter(matches);
    this.done = this.allDone.filter(matches);
  }


  drop(event: CdkDragDrop<any[]>, status: string) {


    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = status;
    }


    const allTasks = [
      ...this.todo,
      ...this.inprogress,
      ...this.await,
      ...this.done
    ];

    localStorage.setItem('tasks', JSON.stringify(allTasks));
  }

  async openAddTask(type: string) {
    const dialogRef = this.addTask.nativeElement;
    this.cardData.progress = type;
    dialogRef.showModal();
    await this.animService.animate(dialogRef, slideInAnimations, 400, true);
  }

  async closeDialog() {
    const dialogRef = this.addTask.nativeElement;
    await this.animService.animate(dialogRef, slideOutAnimations, 300, true);
    dialogRef.close();
  }
}
