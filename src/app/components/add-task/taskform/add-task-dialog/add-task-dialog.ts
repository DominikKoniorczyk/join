import { Component, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { TaskformComponent } from '../taskform';

@Component({
  selector: 'app-add-task-dialog',
  imports: [TaskformComponent],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.scss',
})
export class AddTaskDialog {
  @ViewChild('taskform') form!: TaskformComponent;
  @Output() closeTriggered = new EventEmitter<void>();

  isFormValid = signal<boolean>(false);

  /**
   * Updates the current progress of the form.
   * @param input The new progress value as a string.
   */
   setCurrentProgress(input: string) {
    this.form.progress = input;
  }

  /**
   * Emits an event to close the dialog.
   */
   closeDialog() {
    this.closeTriggered.emit();
  }

  /**
   * Resets the form to its initial state.
   */
   resetForm() {
    this.form.resetForm();
  }

  /**
   * Creates a new task using the form data.
   */
   createTask() {
    this.form.createTask();
  }
}
