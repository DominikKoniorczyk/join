import { SupabaseContactsInterface } from './../../../interfaces/supabase.interfaces';
import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supabase } from '../../../services/supabase';
import { OnInit } from '@angular/core';
import { ContactsSelectorWithSearch } from './contacts-selector-with-search/contacts-selector-with-search';
import { Task } from '../../../interfaces/taskmodel.interfaces';
import { CurrentDate } from '../../../services/current-date';
import { PriorityButton } from '../../../shared/priority-button/priority-button';
import { SubtaskButtonComponent } from './subtask-button/subtask-button';
import { noPastDateValidator } from '../../../services/custom-validators';

@Component({
  selector: 'app-taskform',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ContactsSelectorWithSearch, PriorityButton, SubtaskButtonComponent],
  templateUrl: './taskform.html',
  styleUrls: ['./taskform.scss']
})

export class TaskformComponent implements OnInit {
  @Input() progress: string = "To do";
  @Output() closeTriggered = new EventEmitter<void>();

  @ViewChild('contactsSelector') contactsSelector!: ContactsSelectorWithSearch;
  @ViewChild('subtaskBtnContainer') subtask!: ElementRef<HTMLDivElement>;
  @ViewChild('subtaskInput') subtaskInput!: ElementRef<HTMLInputElement>;

  contacts = signal<SupabaseContactsInterface[]>([]);
  currentDate = signal<string>("2026-02-01");
  currentTask = signal<Task>({ id: 0, headline: "", desc: "", dueDate: "", priority: 1, category: "", assignedTo: [], subtasks: [], progressStatus: 'To do' });
  currentPrio = signal<number>(1);
  taskForm = new FormGroup({
    title: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
    desc: new FormControl(''),
    date: new FormControl('', { validators: [ noPastDateValidator(), Validators.required]}),
    cat: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
    subtask: new FormControl('')
  });

  constructor(private supabase: Supabase, private date: CurrentDate) { }

  async ngOnInit() {
    const data = await this.supabase.getDataFromTable('users');
    if (data) {
      this.contacts.set(data);
    }
    this.subscripeAllInputFields();
    this.currentDate.set(this.date.getCurrentDate());
  }

  /**
   * Updates the current task's progress status after the view has been initialized.
   */
  ngAfterViewInit() {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, progressStatus: this.returnProgress() };
    })
  }

  /**
   * Returns the task's progress status based on the current progress selection.
   * @returns A string representing the current progress status.
   */
  returnProgress(): 'To do' | 'In progress' | 'Await feedback' | 'Done' {
    if (this.progress === 'To do') return 'To do';
    else if (this.progress === 'In progress') return 'In progress';
    else if (this.progress === 'Await feedback') return 'Await feedback';
    else return 'Done';
  }

  /**
   * Closes the contacts selector dropdown if it is open.
   */
  closeDropdown() {
    this.contactsSelector?.closeOnOutsideClick();
  }

  /**
   * Subscribes to all form input fields to update the current task reactively.
   */
  subscripeAllInputFields() {
    this.taskForm.get('title')?.valueChanges.subscribe((value) => {
      this.updateTaskTitle(value!);
    });
    this.taskForm.get('desc')?.valueChanges.subscribe((value) => {
      this.updateTaskDesc(value!);
    });
    this.taskForm.get('date')?.valueChanges.subscribe((value) => {
      this.updateTaskDate(value!);
    });
    this.taskForm.get('cat')?.valueChanges.subscribe((value) => {
      this.updateTaskCat(value!);
    });
  }

  /**
   * Updates the current task's headline/title.
   * @param value The new title value.
   */
  updateTaskTitle(value: string) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, headline: value };
    })
  }

  /**
   * Updates the current task's description.
   * @param value The new description value.
   */
  updateTaskDesc(value: string) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, desc: value };
    })
  }

  /**
   * Updates the current task's due date.
   * @param value The new due date value.
   */
  updateTaskDate(value: string) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, dueDate: value };
    })
  }

  /**
   * Updates the current task's category.
   * @param value The new category value.
   */
  updateTaskCat(value: string) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, category: value };
    })
  }

  /**
   * Sets the priority of the current task and updates the reactive priority state.
   * @param current The new priority value.
   */
  setPriority(current: number) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, priority: current };
    })
    this.currentPrio.set(current);
  }

  /**
   * Shows the subtask input field when focused.
   */
  onFocusSubtask() {
    this.subtask.nativeElement.classList.remove("d-none");
  }

  /**
   * Hides the subtask input field if it is empty when blurred.
   */
  onBlurSubtask() {
    if (this.taskForm.get('subtask')?.value == "")
      this.subtask.nativeElement.classList.add("d-none");
  }

  /**
   * Adds a new subtask to the current task if the subtask input is not empty.
   */
  addSubtask() {
    if (this.taskForm.get('subtask')?.value != "") {
      let currentSubtask = { id: 0, title: this.taskForm.get('subtask')?.value!, isDone: false };
      this.currentTask.update((val) => {
        if (!val) return val;
        return { ...val, subtasks: [...val.subtasks, currentSubtask] };
      })
      this.taskForm.get('subtask')?.setValue("");
      this.subtaskInput.nativeElement.blur();
      this.onBlurSubtask();
    }
  }

  /**
   * Clears the subtask input field.
   */
  clearSubtask() {
    this.taskForm.get('subtask')?.setValue("");
  }

  /**
   * Creates a new task using the current task data and assigned contacts,
   * uploads it to Supabase, resets the form, and closes the dialog.
   */
  createTask() {
    const assignment: SupabaseContactsInterface[] = this.contactsSelector.selectedContacts;
    const uploadData = {
      headline: this.currentTask().headline, desc: this.currentTask().desc, dueDate: this.currentTask().dueDate, priority: this.currentTask().priority,
      category: this.currentTask().category, assignedTo: assignment, subtasks: this.currentTask().subtasks, progressStatus: this.progress
    }
    this.supabase.uploadJSONToTable('tasks', uploadData);
    this.resetForm();
    this.closeTriggered.emit();
  }

  /**
   * Resets the form to its initial state.
   */
  resetForm() {
    this.currentTask.set({ id: 0, headline: "", desc: "", dueDate: "", priority: 1, category: "", assignedTo: [], subtasks: [], progressStatus: 'To do' });
    this.contactsSelector.reset();
    this.taskForm.reset();
  }

  /**
   * Removes a subtask by its index from the current task.
   * @param index The index of the subtask to remove.
   */
  removeSubtask(index: number) {
    this.currentTask.update((val) => {
      if (!val) return val;
      const updated = val.subtasks.filter((_, i) => i !== index);
      return { ...val, subtasks: updated };
    });
  }

  /**
   * Updates the title of a subtask by index.
   * @param event An object containing the subtask index and new title.
   */
  editSubtask(event: { index: number; title: string }) {
    this.currentTask.update((val) => {
      if (!val) return val;
      const updated = val.subtasks.map((st, i) => {
        if (i === event.index) {
          return { ...st, title: event.title };
        }
        return st;
      });
      return { ...val, subtasks: updated };
    });
  }

  /**
   * Handles keydown events in the subtask input.
   * Enter → adds the subtask, Escape → blurs input and hides it.
   * @param ev The keyboard event.
   */
  onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      this.addSubtask();
    }
    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.subtaskInput.nativeElement.blur();
      this.onBlurSubtask();
    }
  }
}
