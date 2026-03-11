import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TaskSearch } from './task-search/task-search';
import { CommonModule } from '@angular/common';
import { AddTaskBtn } from './add-task-btn/add-task-btn';

@Component({
  selector: 'app-board-nav',
  standalone: true,
  imports: [TaskSearch, CommonModule, AddTaskBtn],
  templateUrl: './board-nav.html',
  styleUrl: './board-nav.scss',
})
export class BoardNav {
  @Output() searchChange = new EventEmitter<string>();
  @Output() openAddTask = new EventEmitter<void>();
  @Input() searchResults: boolean = false;

  @ViewChild('search') searchArea!: TaskSearch;

  /**
   * Emits the current search term when it changes.
   *
   * @param {string} term - The new search term entered by the user.
   */
  onSearchChange(term: string) {
    this.searchChange.emit(term);
  }

  /**
   * Updates the search results validity in the search area.
   *
   * @param {boolean} valid - True if search results are valid, false otherwise.
   */
  onSearchResultChange(valid: boolean) {
    this.searchArea.searchResults = valid;
  }
}
