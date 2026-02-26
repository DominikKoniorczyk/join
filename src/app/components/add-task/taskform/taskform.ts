import { SupabaseContactsInterface } from './../../../interfaces/supabase.interfaces';
import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supabase } from '../../../services/supabase';
import { OnInit } from '@angular/core';
import { ContactsSelectorWithSearch } from './contacts-selector-with-search/contacts-selector-with-search';
import { Subtask, Task } from '../../../interfaces/taskmodel.interfaces';
import { CurrentDate } from '../../../services/current-date';
import { PriorityButton } from '../../../shared/priority-button/priority-button';
import { SubtaskButtonComponent } from './subtask-button/subtask-button';

@Component({
  selector: 'app-taskform',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ContactsSelectorWithSearch, PriorityButton, SubtaskButtonComponent],
  templateUrl: './taskform.html',
  styleUrls: ['./taskform.scss']
})

export class TaskformComponent implements OnInit {
  @ViewChild('contactsSelector') contactsSelector!: ContactsSelectorWithSearch;
  @ViewChild('subtaskBtnContainer') subtask!: ElementRef<HTMLDivElement>;
  @ViewChild('subtaskInput') subtaskInput!: ElementRef<HTMLInputElement>;

  contacts = signal<SupabaseContactsInterface[]>([]);
  currentDate = signal<string>("2026-02-01");
  currentTask = signal<Task>({ id: 0, headline: "", desc: "", dueDate: "", priority: 1, category: "", assignedTo: [], subtasks: [], progressStatus: 'To do' });
  currentPrio = signal<number>(1);
  currentSubtask = signal<Subtask[]>([]);
  taskForm = new FormGroup({
    title: new FormControl('', { validators: [Validators.required, Validators.minLength(5)] }),
    desc: new FormControl(''),
    date: new FormControl('', { validators: [Validators.required] }),
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

  closeDropdown() {
    this.contactsSelector?.closeOnOutsideClick();
  }

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

  updateTaskTitle(value: string) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, headline: value };
    })
  }

  updateTaskDesc(value: string) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, desc: value };
    })
  }

  updateTaskDate(value: string) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, dueDate: value };
    })
  }

  updateTaskCat(value: string) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, category: value };
    })
  }

  setPriority(current: number) {
    this.currentTask.update((val) => {
      if (!val) return val;
      return { ...val, priority: current };
    })
    this.currentPrio.set(current);
  }

  onFocusSubtask() {
    this.subtask.nativeElement.classList.remove("d-none");
  }

  onBlurSubtask() {
    if (this.taskForm.get('subtask')?.value == "")
      this.subtask.nativeElement.classList.add("d-none");
  }

  addSubtask() {
    if (this.taskForm.get('subtask')?.value != "") {
      let currentSubtask = { id: 0, title: this.taskForm.get('subtask')?.value!, isDone: false };
      this.currentTask.update((val) => {
        if (!val) return val;
        return { ...val, subtasks: [...val.subtasks, currentSubtask]};
      })
      this.taskForm.get('subtask')?.setValue("");
      this.subtaskInput.nativeElement.blur();
    }
  }

  clearSubtask() {
    this.taskForm.get('subtask')?.setValue("");
  }

  createTask() {
    const assignment: SupabaseContactsInterface[] = this.contactsSelector.selectedContacts;
    const data = {}
    this.resetForm();
  }

  resetForm() {
    this.currentTask.set({ id: 0, headline: "", desc: "", dueDate: "", priority: 1, category: "", assignedTo: [], subtasks: [], progressStatus: 'To do' });
  }

  removeSubtask(index: number) {
    this.currentTask.update((val) => {
      if (!val) return val;
      const updated = val.subtasks.filter((_, i) => i !== index);
      return { ...val, subtasks: updated };
    });
  }

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
}
