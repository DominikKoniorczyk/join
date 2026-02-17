import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss', './summary-responsive.scss']
})
export class Summary {

  // Beispielwerte wir können sie später ändern(oder dynamisch??)
  todoCount: number = 3;
  doneCount: number = 5;
  urgentCount: number = 1;

  inProgressCount: number = 2;
  awaitingFeedbackCount: number = 1;

  allTasksCount: number =
    this.todoCount +
    this.doneCount +
    this.inProgressCount +
    this.awaitingFeedbackCount;

  nextDeadline: Date = new Date();

  greetingText: string = this.getGreeting();
  userName: string = 'Guest';

  private getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
}
