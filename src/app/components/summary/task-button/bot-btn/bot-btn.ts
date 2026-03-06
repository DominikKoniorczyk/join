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


constructor(private supabaseService: Supabase, private router: Router) {}

  async ngOnInit() {
    const data = await this.supabaseService.getDataFromTable('tasks');
    if (data) this.tasks.set(data);
  }
boardCount = computed(() => this.tasks().length);

  progressCount = computed(() =>
    this.tasks().filter(t => t.progressStatus === 'In progress').length
  );

  feedbackCount = computed(() =>
    this.tasks().filter(t => t.progressStatus === 'Await feedback').length
  );


  redirectToBoard(){
    this.router.navigateByUrl('/board');
  }
}
