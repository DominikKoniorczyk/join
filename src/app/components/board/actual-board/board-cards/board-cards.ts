import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ShortenTextsnippetsPipe } from '../../../../pipes/shorten-textsnippets-pipe';
import { Task } from '../../../../interfaces/taskmodel.interfaces';
import { Supabase } from '../../../../services/supabase';

@Component({
  selector: 'app-board-cards',
  standalone: true,
  imports: [DragDropModule, ShortenTextsnippetsPipe],
  templateUrl: './board-cards.html',
  styleUrls: ['./board-cards.scss']
})
export class BoardCardsComponent {

  isDropDownOpen = false;

  @Input() currentTask: Task = { id: 0, headline: "", desc: "", dueDate: "", priority: 1, category: "", assignedTo: [], subtasks: [], progressStatus: 'To do' };
  @Output() cardOpened = new EventEmitter<void>();

  priorityMap: { [key: number]: { label: string, icon: string } } = {
    0: { label: 'Low', icon: 'urgency-low-icon.png' },
    1: { label: 'Medium', icon: 'urgency-medium-icon.png' },
    2: { label: 'Urgent', icon: 'urgency-urgent-icon.png' },
  };

  constructor(private supabase: Supabase) { }

  /**
   * Calculates the completion percentage of subtasks for the current task.
   *
   * @returns {number} The percentage of completed subtasks (0-100).
   */
  getPercentage() {
    if (!this.currentTask?.subtasks || this.currentTask.subtasks.length === 0) return 0;
    const totalAmount = this.currentTask.subtasks.length;
    if (totalAmount == 0) return 0;
    const completed = this.currentTask.subtasks.filter(tasks => tasks.isDone).length;
    return (completed / totalAmount) * 100;
  }

  /**
   * Returns a string representing the number of completed subtasks
   * versus the total number of subtasks.
   *
   * @returns {string} Subtask status in the format "completed/total Subtasks".
   */
  getSubtaskStatus() {
    if (!this.currentTask?.subtasks) return '0/0 Subtasks';
    const totalAmount = this.currentTask.subtasks.length;
    const completed = this.currentTask.subtasks.filter(tasks => tasks.isDone).length;
    return completed + '/' + totalAmount + ' Subtasks'
  }

  /**
   * Emits an event indicating that the task card has been opened.
   */
  openDialog() {
    this.cardOpened.emit();
  }

  /**
   * Generates initials from a given name.
   * Uses the first letter of the first and last word if multiple words exist.
   *
   * @param {string} name - The full name of the person.
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
   * Toggles the visibility of the dropdown menu for the task.
   */
  toggleDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  /**
   * Moves the current task up or down in the workflow for mobile view,
   * updating its progress status and database accordingly.
   *
   * @param {boolean} up - True to move the task up, false to move it down.
   */
  moveTaskMobile(up: boolean) {
    if (up) {
      this.currentTask.progressStatus = this.moveTaskUp();
    } else {
      this.currentTask.progressStatus = this.moveTaskDown();
    }
    this.updateDatabaseAfterMoving();
  }

  /**
   * Determines the next progress status when moving the task up.
   *
   * @returns {'To do' | 'In progress' | 'Await feedback' | 'Done'} The new status.
   */
  moveTaskUp(): 'To do' | 'In progress' | 'Await feedback' | 'Done' {
    switch (this.currentTask.progressStatus) {
      case 'To do': return 'To do';
      case 'In progress': return 'To do';
      case 'Await feedback': return 'In progress';
      case 'Done': return 'Await feedback';
    }
  }

  /**
   * Determines the next progress status when moving the task down.
   *
   * @returns {'To do' | 'In progress' | 'Await feedback' | 'Done'} The new status.
   */
  moveTaskDown(): 'To do' | 'In progress' | 'Await feedback' | 'Done' {
    switch (this.currentTask.progressStatus) {
      case 'To do': return 'In progress';
      case 'In progress': return 'Await feedback';
      case 'Await feedback': return 'Done';
      case 'Done': return 'Done';
    }
  }

  /**
   * Updates the current task in the database with the latest data
   * after moving its progress status.
   */
  updateDatabaseAfterMoving() {
    const newData = {
      headline: this.currentTask.headline, desc: this.currentTask.desc, dueDate: this.currentTask.dueDate, priority: this.currentTask.priority,
      category: this.currentTask.category, assignedTo: this.currentTask.assignedTo, subtasks: this.currentTask.subtasks, progressStatus: this.currentTask.progressStatus
    };
    this.supabase.updateRow("tasks", newData, this.currentTask.id);
  }
}
