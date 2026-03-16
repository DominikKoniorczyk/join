import { Component, OnInit, signal } from '@angular/core';
import { Task } from '../../../../interfaces/taskmodel.interfaces';
import { Supabase } from '../../../../services/supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-btn',
  imports: [],
  templateUrl: './top-btn.html',
  styleUrl: './top-btn.scss',
})
export class TopBtn implements OnInit {
  tasksSignal = signal<Task[]>([]);

  constructor(private supabaseService: Supabase, private router: Router) { }

  /**
   * Angular lifecycle hook that runs after the component has been initialized.
   * Loads all tasks by calling `loadTasks()`.
   *
   * @returns {Promise<void>}
   */
   async ngOnInit() {
    await this.loadTasks();
  }

  /**
   * Fetches all tasks from the Supabase `tasks` table and stores them in the tasks signal.
   *
   * @returns {Promise<void>}
   */
   async loadTasks() {
    const data = await this.supabaseService.getDataFromTable('tasks');
    if (data) {
      this.tasksSignal.set(data);
    }
  }

  /**
   * Returns the count of tasks that match a specific progress status.
   *
   * @param {string} status - The progress status to filter tasks by.
   * @returns {number} The number of tasks with the given status.
   */
   getTaskCount(status: string): number {
    return this.tasksSignal().filter(task => task.progressStatus === status).length;
  }

  /**
   * Navigates the user to the board page using the Angular router.
   */
   redirectToBoard() {
    this.router.navigateByUrl('/board');
  }
}
