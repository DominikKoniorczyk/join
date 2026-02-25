import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Task, Subtask } from '../../../../interfaces/taskmodel.interfaces';

@Component({
  selector: 'app-board-cards-full',
  imports: [],
  templateUrl: './board-cards-full.html',
  styleUrl: './board-cards-full.scss',
})
export class BoardCardsFull {

@Input() task!: Task;

@Output() closeTriggered = new EventEmitter<void>();

isEditing = false;

onClose(){
  this.closeTriggered.emit();
}


priorityMap: {[key: number]:{label: string, icon: string}} = {
    1: {label: 'Low', icon: 'urgency-low-icon.png'},
    2: {label: 'Medium', icon: 'urgency-medium-icon.png'},
    3: {label: 'Urgend', icon: 'urgency-urgent-icon.png'},
  };

toggleSubtask(subtask: Subtask){
  subtask.isDone = !subtask.isDone;
}

toggleEditMode(){
  this.isEditing = true;
}


}
