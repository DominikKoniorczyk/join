import { ContactsSelectorWithSearch } from './../../../add-task/taskform/contacts-selector-with-search/contacts-selector-with-search';
import { Component, ElementRef, EventEmitter, inject, Output, signal, ViewChild } from '@angular/core';
import { Task, Subtask } from '../../../../interfaces/taskmodel.interfaces';
import { CurrentDate } from '../../../../services/current-date';
import { PriorityButton } from '../../../../shared/priority-button/priority-button';
import { SubtaskButtonComponent } from '../../../add-task/taskform/subtask-button/subtask-button';
import { Supabase } from '../../../../services/supabase';
import { CdkDropListGroup, CdkDropList } from "@angular/cdk/drag-drop";


@Component({
  selector: 'app-board-cards-full',
  imports: [PriorityButton, ContactsSelectorWithSearch, SubtaskButtonComponent],
  templateUrl: './board-cards-full.html',
  styleUrl: './board-cards-full.scss',
})
export class BoardCardsFull {

  @Output() closeTriggered = new EventEmitter<void>();

  isEditing = false;
  tempPriority: number = 0;
  dataService = inject(CurrentDate);
  currentDate = signal<string>(this.dataService.getCurrentDate());
  currentTask = signal<Task>({ id: 0, headline: "", desc: "", dueDate: "", priority: 1, category: "", assignedTo: [], subtasks: [], progressStatus: 'To do' });

  @ViewChild('headlineInput') headlineInput!: ElementRef<HTMLInputElement>;
  @ViewChild('descInput') descInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

@ViewChild('selector') selector!: ContactsSelectorWithSearch;

  constructor(private supabase: Supabase){ }

  onClose() {
    this.closeTriggered.emit();
  }

  initModal(data: Task) {
    this.currentTask.set(data);
  }


  priorityMap: { [key: number]: { label: string, icon: string } } = {
    0: { label: 'Low', icon: 'urgency-low-icon.png' },
    1: { label: 'Medium', icon: 'urgency-medium-icon.png' },
    2: { label: 'Urgent', icon: 'urgency-urgent-icon.png' },
  };

  toggleSubtask(subtask: Subtask) {
    subtask.isDone = !subtask.isDone;
  }

  startEditing() {
    this.isEditing = true;
    this.tempPriority = this.currentTask().priority;
    this.currentTask.set({ ...this.currentTask(), subtasks: [...this.currentTask().subtasks] });
  }

  saveChanges() {
    this.currentTask().headline = this.headlineInput.nativeElement.value;
    this.currentTask().desc = this.descInput.nativeElement.value;
    this.currentTask().dueDate = this.dateInput.nativeElement.value;
    this.currentTask().priority = this.tempPriority;
    this.currentTask().subtasks = [...this.currentTask().subtasks];
    this.isEditing = false;
    this.pushDataToSupabase();
  }

  deleteTask(){
    this.supabase.deleteRow('tasks', this.currentTask().id);
    this.closeTriggered.emit();
  }

  pushDataToSupabase(){
    this.supabase.updateRow('tasks', this.currentTask(), this.currentTask().id);
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

  clearSubtaskInput(inputElement: HTMLInputElement) {
    inputElement.value = '';
    inputElement.focus();
  }

  addSubtask(inputElement: HTMLInputElement) {
    const value = inputElement.value.trim();
    if (value !== '') {
      const newSubtask = {
        id: Date.now(),
        title: value,
        isDone: false
      };
      this.currentTask.update((task) => { return { ...task, subtasks: [...task.subtasks, newSubtask] }; });
      inputElement.value = '';
      inputElement.focus();
    }
  }

  removeSubtask(index: number) {
    this.currentTask.update(task => ({
      ...task,
      subtasks: task.subtasks.filter((_, i) => i !== index)
    }));
  }

  editSubtask(event: { index: number; title: string }) {
    this.currentTask.update(task => {
      const updatedSubtasks = [...task.subtasks];
      if (updatedSubtasks[event.index]) {
        updatedSubtasks[event.index] = {
          ...updatedSubtasks[event.index],
          title: event.title
        };
      }
      return { ...task, subtasks: updatedSubtasks };
    });
  }

  closeDropdown(){
    this.selector?.closeOnOutsideClick();
  }

}
