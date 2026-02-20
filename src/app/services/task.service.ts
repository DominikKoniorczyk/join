import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks: any[] = [];

  addTask(task: any) {
    this.tasks.push(task);
  }

  getTasks() {
    return this.tasks;
  }
}