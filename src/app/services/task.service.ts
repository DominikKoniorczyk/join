import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: any[] = [];

  constructor() {
    this.loadTasks();
  }

  /**
   * Returns the current list of tasks stored in the service.
   *
   * @returns {any[]} The array of tasks.
   */
   getTasks() {
    return this.tasks;
  }

  /**
   * Adds a new task to the task list and persists the updated list
   * to the browser's localStorage.
   *
   * @param {any} task - The task object to be added to the list.
   */
   addTask(task: any) {
    this.tasks.push(task);
    this.saveTasks();
  }

  /**
   * Saves the current task list to the browser's localStorage.
   * The tasks array is serialized into a JSON string before storage.
   */
   saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  /**
   * Loads tasks from the browser's localStorage.
   * If stored data exists, it is parsed from JSON and assigned
   * to the tasks array. If no data exists, an empty array is used.
   */
   loadTasks() {
    const data = localStorage.getItem('tasks');
    this.tasks = data ? JSON.parse(data) : [];
  }
}
