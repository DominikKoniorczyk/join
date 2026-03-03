import { Component,  ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ActualBoard } from './actual-board/actual-board';
import { BoardNav } from './board-nav/board-nav';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, BoardNav, ActualBoard],
  templateUrl: './board.html',
  styleUrls: ['./board.scss']
})
export class Board {

  @ViewChild('actualBoard') actualBoard!: ActualBoard;

  searchTerm: string = '';
  currentTaks: string = 'To do';

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

  /**
   * Updates the current search term and applies it to the task lists.
   * @param term The search term entered by the user.
   */
  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applySearch();
  }

  /**
   * Filters all task lists based on the current search term.
   * If the search term is empty, all tasks are restored.
   */
  applySearch() {
    const term = (this.searchTerm || '').toLowerCase().trim();
    if (!term) {
      this.resetSearchResult();
      return;
    }
    const matches = (t: any) =>
      (t.title || t.headline || '').toLowerCase().includes(term) ||
      (t.description || t.desc || '').toLowerCase().includes(term);
    this.applySearchResult(matches);
  }

  /**
   * Resets all task lists to their original state,
   * restoring all tasks without any filtering.
   */
  resetSearchResult() {
    this.todo = [...this.allTodo];
    this.inprogress = [...this.allInprogress];
    this.await = [...this.allAwait];
    this.done = [...this.allDone];
  }

  /**
   * Applies a search filter to all task lists.
   * @param matches A callback function used to determine if a task should be included.
   */
  applySearchResult(matches: any) {
    this.todo = this.allTodo.filter(matches);
    this.inprogress = this.allInprogress.filter(matches);
    this.await = this.allAwait.filter(matches);
    this.done = this.allDone.filter(matches);
  }

  /**
   * Opens the "Add Task" dialog for the specified board type.
   * @param type The type of task list (e.g., 'To do').
   */
  async openAddTask(type: string) {
    this.actualBoard.openAddTask('To do');
  }
}
