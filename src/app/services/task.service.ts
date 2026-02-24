import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: any[] = [];

  constructor() {
    this.loadTasks();
  }

  getTasks() {
    return this.tasks;
  }

  addTask(task: any) {
    this.tasks.push(task);
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const data = localStorage.getItem('tasks');
    this.tasks = data ? JSON.parse(data) : [];
  }
}