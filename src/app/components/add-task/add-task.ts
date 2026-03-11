import { Component, signal, ViewChild } from '@angular/core';
import { TaskformComponent } from './taskform/taskform';
import defaultTasks from '../../JSON/defaultTasks.json';
import { Task } from '../../interfaces/taskmodel.interfaces';
import { Supabase } from '../../services/supabase';

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
  isLoading = signal<boolean>(true);
  dataTask = signal<Task[]>([]);
  shouldRegenerateTasks: boolean = false;
  initialTasks = defaultTasks;

  constructor(private supabaseClientService: Supabase) { }

  /**
   * Restores the tasks table to the default contacts.
   * Deletes all current task rows and uploads the default tasks.
   */
  async restoreTasksToDefault() {
    await this.getDataInitial();
    for (let i = 0; this.dataTask().length; i++) {
      this.supabaseClientService.deleteRow('tasks', this.dataTask()[i].id);
    }
    this.supabaseClientService.uploadJSONToTable('tasks', this.initialTasks);
  }

  /**
     * Fetches the initial user data from the 'users' table and updates the local state.
     */
  async getDataInitial() {
    const data = (await this.supabaseClientService.getDataFromTable(
      'tasks',
    )) as Task[];
    this.dataTask.set(data ?? []);
    this.isLoading.set(false);
  }

  /**
   * Angular lifecycle hook that runs after the component's view has been fully initialized.
   * Subscribes to form status changes to keep the `isFormValid` signal updated.
   * Optionally restores default tasks if `shouldRegenerateTasks` is enabled.
   */
  ngAfterViewInit() {
    if (this.form.taskForm) {
      this.form.taskForm.statusChanges.subscribe(status => {
        this.isFormValid.set(this.form.taskForm.valid);
      })
    }
    if (this.shouldRegenerateTasks) this.restoreTasksToDefault();
  }

  /**
   * Closes the dropdown menu through the form component.
   */
  closeDropdown() {
    this.form.closeDropdown();
  }

  /**
   * Resets the task form to its initial state.
   */
  resetForm() {
    this.form.resetForm();
  }

  /**
   * Triggers the task creation process through the form component.
   */
  createTask() {
    this.form.createTask();
  }
}
