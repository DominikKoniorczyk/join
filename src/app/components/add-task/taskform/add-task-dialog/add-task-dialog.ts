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

  setCurrentProgress(input: string){
    this.form.progress = input;
  }

  closeDialog(){
    this.closeTriggered.emit();
  }

  resetForm() {
    this.form.resetForm();
  }

  createTask() {
    this.form.createTask();
  }
}
