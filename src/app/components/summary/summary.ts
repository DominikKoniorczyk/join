import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss', './summary-responsive.scss']
})
export class Summary implements OnInit {

  tasks: any[] = [];

  todoCount: number = 0;
  doneCount: number = 0;
  urgentCount: number = 0;
  inProgressCount: number = 0;
  awaitingFeedbackCount: number = 0;
  allTasksCount: number = 0;

  nextDeadline: Date | null = null;

  greetingText: string = this.getGreeting();
  userName: string = 'Guest';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.tasks = this.taskService.getTasks();
    this.calculateCounts();
  }

  calculateCounts() {
    this.todoCount = this.tasks.filter(t => t.status === 'todo').length;
    this.doneCount = this.tasks.filter(t => t.status === 'done').length;
    this.inProgressCount = this.tasks.filter(t => t.status === 'inprogress').length;
    this.awaitingFeedbackCount = this.tasks.filter(t => t.status === 'feedback').length;

    this.urgentCount = this.tasks.filter(t => t.priority === 'urgent').length;

    this.allTasksCount =
      this.todoCount +
      this.doneCount +
      this.inProgressCount +
      this.awaitingFeedbackCount;

    // 👉 nächste Deadline berechnen
    const dates = this.tasks
      .map(t => new Date(t.dueDate))
      .filter(d => !isNaN(d.getTime()));

    if (dates.length > 0) {
      this.nextDeadline = new Date(Math.min(...dates.map(d => d.getTime())));
    }
  }

  private getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
}