import { Component, signal, ViewChild } from '@angular/core';
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

  isFormValid = signal<boolean>(false);

  ngAfterViewInit() {
    if (this.form.taskForm) {
      this.form.taskForm.statusChanges.subscribe(status => {
        this.isFormValid.set(this.form.taskForm.valid);
      })
    }
  }

  closeDropdown() {
    this.form.closeDropdown();
  }

  resetForm() {
    this.form.resetForm();
  }

  createTask() {
    this.form.createTask();
  }
}
