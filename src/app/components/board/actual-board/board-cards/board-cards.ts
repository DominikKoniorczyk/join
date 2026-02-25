import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ShortenTextsnippetsPipe } from '../../../../pipes/shorten-textsnippets-pipe';
import { Task } from '../../../../interfaces/taskmodel.interfaces';

@Component({
  selector: 'app-board-cards',
  standalone: true,
  imports: [DragDropModule, ShortenTextsnippetsPipe],
  templateUrl: './board-cards.html',
  styleUrls: ['./board-cards.scss']
})
export class BoardCardsComponent {

  @Input() task!: Task;

  @Output() cardOpened = new EventEmitter<void>();

  priorityMap: { [key: number]: { label: string, icon: string } } = {
    0: { label: 'Low', icon: 'urgency-low-icon.png' },
    1: { label: 'Medium', icon: 'urgency-medium-icon.png' },
    2: { label: 'Urgent', icon: 'urgency-urgent-icon.png' },
  };

  getPercentage(){
    if(!this.task?.subtasks || this.task.subtasks.length === 0) return 0;
    const totalAmount = this.task.subtasks.length;
    if (totalAmount == 0) return 0;
    const completed = this.task.subtasks.filter(tasks => tasks.isDone).length;
    return (completed / totalAmount) * 100;
  }

  getSubtaskStatus(){
    if(!this.task?.subtasks) return '0/0 Subtasks';
    const totalAmount = this.task.subtasks.length;
    const completed = this.task.subtasks.filter(tasks => tasks.isDone).length;
    return completed + '/' + totalAmount + ' Subtasks'
  }

  openDialog(){
    this.cardOpened.emit();
  }

  getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return (parts.length > 1
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0][0]).toUpperCase();
}
}
