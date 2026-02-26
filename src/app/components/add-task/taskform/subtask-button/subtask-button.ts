import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subtask-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subtask-button.html',
  styleUrls: ['./subtask-button.scss'],
})

export class SubtaskButtonComponent {
  @Input() title: string = '';
  @Input() index: number = 0;

  @Output() deleteSubtask = new EventEmitter<number>();
  @Output() updateSubtask = new EventEmitter<{ index: number; title: string }>();

  @ViewChild('editInput') editInput?: ElementRef<HTMLInputElement>;
  isEditing: boolean = false;
  editValue: string = '';

  startEdit() {
    this.isEditing = true;
    this.editValue = this.title;
    setTimeout(() => {
      this.editInput?.nativeElement.focus();
    }, 0);
  }

  confirmEdit() {
    const cleaned = this.editValue.trim();
    if (cleaned === '') return;
    this.updateSubtask.emit({ index: this.index, title: cleaned });
    this.isEditing = false;
  }

  onDelete() {
    this.deleteSubtask.emit(this.index);
  }

  onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      this.confirmEdit();
    }

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.isEditing = false;
    }
  }
}