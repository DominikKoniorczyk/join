import { Component, OnInit, signal } from '@angular/core';
import { Task } from '../../../../interfaces/taskmodel.interfaces';
import { Supabase } from '../../../../services/supabase';

@Component({
  selector: 'app-top-btn',
  imports: [],
  templateUrl: './top-btn.html',
  styleUrl: './top-btn.scss',
})
export class TopBtn implements OnInit {
  tasksSignal = signal<Task[]>([]);

  constructor(private supabaseService: Supabase) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    const data = await this.supabaseService.getDataFromTable('tasks');
    if (data) {
      this.tasksSignal.set(data);
    }
  }

  getTaskCount(status: string): number {
    return this.tasksSignal().filter(task => task.progressStatus === status).length;
  }
}
