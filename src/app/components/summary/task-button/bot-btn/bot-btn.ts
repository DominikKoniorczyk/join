import { Component, computed, signal } from '@angular/core';
import { Supabase } from '../../../../services/supabase';
import { Task } from '../../../../interfaces/taskmodel.interfaces';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-bot-btn',
  imports: [RouterLink],
  templateUrl: './bot-btn.html',
  styleUrl: './bot-btn.scss',
})
export class BotBtn {
  tasks = signal<Task[]>([]);
  boardCount = computed(() => this.tasks().length);
  progressCount = computed(() => this.tasks().filter(t => t.progressStatus === 'In progress').length);
  feedbackCount = computed(() => this.tasks().filter(t => t.progressStatus === 'Await feedback').length);

  constructor(private supabaseService: Supabase, private router: Router) { }

  /**
   * Angular lifecycle hook that runs after the component has been initialized.
   * Fetches all tasks from the Supabase `tasks` table and stores them in the local signal.
   *
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    const data = await this.supabaseService.getDataFromTable('tasks');
    if (data) this.tasks.set(data);
  }

  /**
   * Navigates the user to the board page using the Angular router.
   */
  redirectToBoard() {
    this.router.navigateByUrl('/board');
  }
}
