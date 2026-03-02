import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ActualBoard } from './actual-board/actual-board';
import { BoardNav } from './board-nav/board-nav';
import { AnimationService } from '../../services/animation.service';
import { AddTaskDialog } from '../add-task/taskform/add-task-dialog/add-task-dialog';
import { slideInAnimations, slideOutAnimations } from './animations-board/dialog.animation';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, BoardNav, ActualBoard, AddTaskDialog],
  templateUrl: './board.html',
  styleUrls: ['./board.scss']
})
export class Board implements OnInit {

  @ViewChild('actualBoard') actualBoard!: ActualBoard;

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

  async openAddTask(type: string) {
    this.actualBoard.openAddTask('To do');
  }
}
