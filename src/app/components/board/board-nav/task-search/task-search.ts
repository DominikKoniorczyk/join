import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-search.html',
  styleUrl: './task-search.scss',
})
export class TaskSearch {
  @Output() searchChange = new EventEmitter<string>();
  searchTerm: string = '';
  @Input() searchResults: boolean = false;

  /**
   * Emits the current search term whenever the input value changes.
   */
  onInput(): void {
    this.searchChange.emit(this.searchTerm);
  }

  /**
   * Clears the search input and emits an empty string.
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.searchChange.emit('');
  }
}
