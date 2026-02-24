import { Component, EventEmitter, Output } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ShortenTextsnippetsPipe } from '../../../../pipes/shorten-textsnippets-pipe';

@Component({
  selector: 'app-board-cards',
  standalone: true,
  imports: [DragDropModule, ShortenTextsnippetsPipe],
  templateUrl: './board-cards.html',
  styleUrls: ['./board-cards.scss']
})
export class BoardCardsComponent {

  @Output() cardOpened = new EventEmitter<void>();

  task = {
    title: 'Kochweltpage & Recipe Recommender',
    subtask: [
      {name: 'Implement Recipe Recommendation', done:true },
      {name: 'Start Page Layout', done:true },
      {name: 'Start Page Layout', done:false },
    ]
  }

  getPercentage(){
    const totalAmount = this.task.subtask.length;
    if (totalAmount == 0) return 0;
    const completed = this.task.subtask.filter(tasks => tasks.done).length;
    return (completed / totalAmount) * 100;
  }

  getSubtaskStatus(){
    const totalAmount = this.task.subtask.length;
    const completed = this.task.subtask.filter(tasks => tasks.done).length;
    return completed + '/' + totalAmount + ' Subtasks'
  }

  openDialog(){
    this.cardOpened.emit();
  }
}
