import { Component, ViewChild } from '@angular/core';
import { TaskformComponent } from './taskform/taskform';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [TaskformComponent],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.scss']
})
export class AddTaskComponent {
  @ViewChild('taskForm') form!: TaskformComponent;

  closeDropdown(){
    this.form?.closeDropdown();
  }
}
