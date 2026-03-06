import { Component, computed, OnInit, signal } from '@angular/core';
import { Task } from '../../../../interfaces/taskmodel.interfaces';
import { Supabase } from '../../../../services/supabase';
import { CurrentDate } from '../../../../services/current-date';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mid-btn',
  imports: [DatePipe],
  templateUrl: './mid-btn.html',
  styleUrl: './mid-btn.scss',
})
export class MidBtn implements OnInit{
  tasks = signal<Task[]>([]);

  readonly priorityMap: { [key: number]: { label: string, icon: string } } = {
    0: { label: 'Low', icon: 'urgency-low-icon.png' },
    1: { label: 'Medium', icon: 'urgency-medium-icon.png' },
    2: { label: 'Urgent', icon: 'urgency-urgent-icon.png' },
  };

  constructor(private supabaseService: Supabase, private dateService: CurrentDate) {}

 nextTask = computed(() => {
    const today = new Date(this.dateService.getCurrentDate());
    today.setHours(0, 0, 0, 0);

    return this.tasks()
      .filter(t => t.progressStatus !== 'Done' && new Date(t.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0] || null;
  });

  async ngOnInit() {
    const data = await this.supabaseService.getDataFromTable('tasks');
    if (data) {
      this.tasks.set(data);
    }
  }

  nextDeadline = computed(() => {
    const task = this.nextTask();
    return task ? task.dueDate:null;
  })

  taskCountForDate = computed(()=> {
    const deadline = this.nextDeadline();
    if(!deadline) return 0;
    return this.tasks().filter(task => task.dueDate === deadline && task.progressStatus !== 'Done').length;
  })

  priorityText = computed(() => {
  const task = this.nextTask();
  if (!task) return '';

  switch (task.priority) {
    case 0: return 'Low';
    case 1: return 'Medium';
    case 2: return 'Urgent';
    default: return 'Medium';
  }
});

}
