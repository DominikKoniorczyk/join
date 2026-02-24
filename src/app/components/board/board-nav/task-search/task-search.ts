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

  // @Output() searchChange = new EventEmitter<string>();

  // searchTerm: string = '';

  // onInput(event: Event): void {
  //   const value = (event.target as HTMLInputElement).value;
  //   this.searchTerm = value;
  //   this.searchChange.emit(value);
  // }

  // clearSearch(): void {
  //   this.searchTerm = '';
  //   this.searchChange.emit('');
  // }
}
