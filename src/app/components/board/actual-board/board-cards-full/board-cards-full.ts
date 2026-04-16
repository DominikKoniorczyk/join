import { ContactsSelectorWithSearch } from './../../../add-task/taskform/contacts-selector-with-search/contacts-selector-with-search';
import { Component, ElementRef, EventEmitter, inject, Output, signal, ViewChild } from '@angular/core';
import { Task, Subtask } from '../../../../interfaces/taskmodel.interfaces';
import { CurrentDate } from '../../../../services/current-date';
import { PriorityButton } from '../../../../shared/priority-button/priority-button';
import { SubtaskButtonComponent } from '../../../add-task/taskform/subtask-button/subtask-button';
import { Supabase } from '../../../../services/supabase';


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
  currentTask = signal<Task>({ id: 0, headline: "", desc: "", dueDate: "", priority: 1, category: "", assignedTo: [], subtasks: [], progressStatus: 'To do' , attachments: []});

  @ViewChild('headlineInput') headlineInput!: ElementRef<HTMLInputElement>;
  @ViewChild('descInput') descInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('selector') selector!: ContactsSelectorWithSearch;

  constructor(private supabase: Supabase) { }

  /**
   * Closes the modal and exits edit mode.
   * Emits the `closeTriggered` event.
   */
   onClose() {
    this.isEditing = false;
    this.closeTriggered.emit();
  }

  /**
   * Initializes the modal with a given task.
   *
   * @param {Task} data - The task data to load into the modal.
   */
   initModal(data: Task) {
    this.currentTask.set(data);
  }

  /**
   * Maps priority levels to labels and icons.
   */
   priorityMap: { [key: number]: { label: string, icon: string } } = {
    0: { label: 'Low', icon: 'urgency-low-icon.png' },
    1: { label: 'Medium', icon: 'urgency-medium-icon.png' },
    2: { label: 'Urgent', icon: 'urgency-urgent-icon.png' },
  };

  /**
   * Toggles the completion status of a subtask and updates it in Supabase.
   *
   * @param {Subtask} subtask - The subtask to toggle.
   */
   toggleSubtask(subtask: Subtask) {
    subtask.isDone = !subtask.isDone;
    const task = { headline: this.currentTask().headline, desc: this.currentTask().desc, dueDate: this.currentTask().dueDate, priority: this.currentTask().priority, category: this.currentTask().category, assignedTo: this.currentTask().assignedTo, subtasks: this.currentTask().subtasks, progressStatus: this.currentTask().progressStatus };
    task.subtasks.forEach(el => {
      if (el.title == subtask.title) {
        el.isDone = subtask.isDone;
      }
    });
    this.supabase.updateRow("tasks", task, this.currentTask().id);
  }

  /**
   * Enables editing mode for the task and stores the temporary priority.
   */
   startEditing() {
    this.isEditing = true;
    this.tempPriority = this.currentTask().priority;
    this.currentTask.set({ ...this.currentTask(), subtasks: [...this.currentTask().subtasks] });
  }

  /**
   * Saves changes made to the task fields and updates Supabase.
   */
   saveChanges() {
    this.currentTask().headline = this.headlineInput.nativeElement.value;
    this.currentTask().desc = this.descInput.nativeElement.value;
    this.currentTask().dueDate = this.dateInput.nativeElement.value;
    this.currentTask().priority = this.tempPriority;
    this.currentTask().subtasks = [...this.currentTask().subtasks];
    this.isEditing = false;
    this.pushDataToSupabase();
  }

  /**
   * Deletes the current task from Supabase and triggers modal close.
   */
   deleteTask() {
    this.supabase.deleteRow('tasks', this.currentTask().id);
    this.closeTriggered.emit();
  }

  /**
   * Pushes the current task data to Supabase.
   */
   pushDataToSupabase() {
    this.supabase.updateRow('tasks', this.currentTask(), this.currentTask().id);
  }

  /**
   * Sets the temporary priority for the task while editing.
   *
   * @param {number} prio - Priority value to set.
   */
   setPriority(prio: number) {
    this.tempPriority = prio;
  }

  /**
   * Generates initials from a name.
   *
   * @param {string} name - Full name of the user.
   * @returns {string} Uppercase initials.
   */
   getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return (parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0][0]).toUpperCase();
  }

  /**
   * Clears the value of a subtask input field and focuses it.
   *
   * @param {HTMLInputElement} inputElement - The input element to clear.
   */
   clearSubtaskInput(inputElement: HTMLInputElement) {
    inputElement.value = '';
    inputElement.focus();
  }

  /**
   * Adds a new subtask to the current task from an input element.
   *
   * @param {HTMLInputElement} inputElement - The input element containing the subtask title.
   */
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

  /**
   * Removes a subtask by its index from the current task.
   *
   * @param {number} index - Index of the subtask to remove.
   */
   removeSubtask(index: number) {
    this.currentTask.update(task => ({
      ...task,
      subtasks: task.subtasks.filter((_, i) => i !== index)
    }));
  }

  /**
   * Edits the title of a subtask at a given index.
   *
   * @param {{ index: number; title: string }} event - Object containing the subtask index and new title.
   */
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

  /**
   * Closes the dropdown selector using the component's close handler.
   */
   closeDropdown() {
    this.selector?.closeOnOutsideClick();
  }
}
