import { Component, computed, OnInit, signal } from '@angular/core';
import { Task } from '../../../../interfaces/taskmodel.interfaces';
import { Supabase } from '../../../../services/supabase';
import { CurrentDate } from '../../../../services/current-date';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mid-btn',
  imports: [DatePipe],
  templateUrl: './mid-btn.html',
  styleUrl: './mid-btn.scss',
})
export class MidBtn implements OnInit {
  tasks = signal<Task[]>([]);
  readonly priorityMap: Record<number, { label: string, type: number }> = {
    0: { label: 'Low', type: 0 },
    1: { label: 'Medium', type: 1 },
    2: { label: 'Urgent', type: 2 },
  };
  nextTask = computed(() => {
    const today = new Date(this.dateService.getCurrentDate());
    today.setHours(0, 0, 0, 0);
    return this.tasks()
      .filter(t => t.progressStatus !== 'Done' && new Date(t.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0] || null;
  });
  nextDeadline = computed(() => {
    const task = this.nextTask();
    return task ? task.dueDate : null;
  });
  priorityText = computed(() => 'Urgent');
  urgentTasks = computed(() => {
    const today = new Date(this.dateService.getCurrentDate());
    today.setHours(0, 0, 0, 0);
    return this.tasks().filter(t =>
      t.progressStatus !== 'Done' &&
      t.priority === 2 &&
      new Date(t.dueDate) >= today
    );
  });
  taskCountForDate = computed(() => this.urgentTasks().length);


  constructor(private supabaseService: Supabase, private dateService: CurrentDate, private router: Router) { }

  /**
   * Angular lifecycle hook that runs after the component is initialized.
   * Retrieves all tasks from the Supabase `tasks` table and stores them in the `tasks` signal.
   *
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    const data = await this.supabaseService.getDataFromTable('tasks');
    if (data) {
      this.tasks.set(data);
    }
  }

  /**
   * Navigates the user to the '/board' route using the Angular router.
   */
  redirectToBoard() {
    this.router.navigateByUrl('/board');
  }
}
