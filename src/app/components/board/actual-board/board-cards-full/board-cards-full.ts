import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
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
tempPriority: number = 0;

@ViewChild('headlineInput') headlineInput!: ElementRef<HTMLInputElement>;
@ViewChild('descInput') descInput!: ElementRef<HTMLInputElement>;
@ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

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

startEditing(){
  this.isEditing = true;
  this.tempPriority = this.task.priority;
}

saveChanges(){
  this.task.headline = this.headlineInput.nativeElement.value;
  this.task.desc = this.descInput.nativeElement.value;
  this.task.dueDate = this.dateInput.nativeElement.value;
  this.task.priority = this.tempPriority;
  this.isEditing = false;
}


}
