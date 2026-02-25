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
}
