import { Component, EventEmitter, Output } from '@angular/core';
import { TaskSearch } from '../boardNav/task-search/task-search';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board-nav',
  standalone: true,
  imports: [TaskSearch, CommonModule],
  templateUrl: './board-nav.html',
  styleUrl: './board-nav.scss',
})
export class BoardNav {

  @Output() search = new EventEmitter<string>();
  @Output() openAddTask = new EventEmitter<void>();

  onSearch(value: string): void {
    this.search.emit(value);
  }

  addTask(): void {
    this.openAddTask.emit();
  }
}