import { Component, EventEmitter, Output } from '@angular/core';
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

  onInput(): void {
    this.searchChange.emit(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchChange.emit('');
  }
}