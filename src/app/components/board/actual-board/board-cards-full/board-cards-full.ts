import { Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { Task, Subtask } from '../../../../interfaces/taskmodel.interfaces';
import { CurrentDate } from '../../../../services/current-date';
import { PriorityButton } from '../../../../shared/priority-button/priority-button';
import { ContactsSelectorWithSearch } from '../../../add-task/taskform/contacts-selector-with-search/contacts-selector-with-search';

@Component({
  selector: 'app-board-cards-full',
  imports: [PriorityButton, ContactsSelectorWithSearch],
  templateUrl: './board-cards-full.html',
  styleUrl: './board-cards-full.scss',
})
export class BoardCardsFull {

@Input() task!: Task;

@Output() closeTriggered = new EventEmitter<void>();

isEditing = false;
tempPriority: number = 0;
dataService = inject(CurrentDate);
currentDate = signal<string>(this.dataService.getCurrentDate());




@ViewChild('headlineInput') headlineInput!: ElementRef<HTMLInputElement>;
@ViewChild('descInput') descInput!: ElementRef<HTMLInputElement>;
@ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

onClose(){
  this.closeTriggered.emit();
}


priorityMap: {[key: number]:{label: string, icon: string}} = {
    0: {label: 'Low', icon: 'urgency-low-icon.png'},
    1: {label: 'Medium', icon: 'urgency-medium-icon.png'},
    2: {label: 'Urgent', icon: 'urgency-urgent-icon.png'},
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

setPriority(prio: number) {
  this.tempPriority = prio;
}

getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return (parts.length > 1
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0][0]).toUpperCase();
}

}
