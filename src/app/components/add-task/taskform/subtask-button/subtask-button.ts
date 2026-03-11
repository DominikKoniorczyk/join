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

  /**
   * Enables edit mode for the subtask and focuses the input field.
   * The current title is copied into the editable value.
   */
  startEdit() {
    this.isEditing = true;
    this.editValue = this.title;
    setTimeout(() => {
      this.editInput?.nativeElement.focus();
    }, 0);
  }

  /**
   * Confirms the edit of the subtask title.
   * Trims the input value and emits the updated title if it is not empty.
   * Exits edit mode after emitting the change.
   */
  confirmEdit() {
    const cleaned = this.editValue.trim();
    if (cleaned === '') return;
    this.updateSubtask.emit({ index: this.index, title: cleaned });
    this.isEditing = false;
  }

  /**
   * Emits an event to delete the current subtask using its index.
   */
  onDelete() {
    this.deleteSubtask.emit(this.index);
  }

  /**
   * Handles keyboard events while editing the subtask.
   * - Enter confirms the edit.
   * - Escape cancels edit mode.
   *
   * @param {KeyboardEvent} ev - The keyboard event triggered by the user.
   */
  onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      this.confirmEdit();
    }
    else if (ev.key === 'Escape') {
      ev.preventDefault();
      this.isEditing = false;
    }
  }
}
