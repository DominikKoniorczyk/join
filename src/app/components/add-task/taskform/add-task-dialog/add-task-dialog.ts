import { Component, EventEmitter, Output } from '@angular/core';
import { TaskformComponent } from '../taskform';

@Component({
  selector: 'app-add-task-dialog',
  imports: [TaskformComponent],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.scss',
})
export class AddTaskDialog {
  @Output() closeTriggered = new EventEmitter<void>();

  progress: string = "To do";
}
