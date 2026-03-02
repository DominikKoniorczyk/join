import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-task-btn',
  imports: [],
  templateUrl: './add-task-btn.html',
  styleUrl: './add-task-btn.scss',
})
export class AddTaskBtn {
  @Output() openAddTask = new EventEmitter<void>();

  onClickedAddTask(){
    this.openAddTask.emit();
  }
}
