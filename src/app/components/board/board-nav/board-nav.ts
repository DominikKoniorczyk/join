import { Component, EventEmitter, Output } from '@angular/core';
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

  onSearchChange(term: string) {
    this.searchChange.emit(term);
  }
}
