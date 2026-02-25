import { SupabaseContactsInterface } from './../../../interfaces/supabase.interfaces';
import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Supabase } from '../../../services/supabase';
import { OnInit } from '@angular/core';
import { ContactsSelectorWithSearch } from './contacts-selector-with-search/contacts-selector-with-search';
import { Task } from '../../../interfaces/taskmodel.interfaces';

@Component({
  selector: 'app-taskform',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ContactsSelectorWithSearch],
  templateUrl: './taskform.html',
  styleUrls: ['./taskform.scss']
})
export class TaskformComponent implements OnInit {
  @ViewChild('contactsSelector') contactsSelector!: ContactsSelectorWithSearch;
  @ViewChild('subtaskBtnContainer') subtask!: ElementRef<HTMLDivElement>;

  contacts = signal<SupabaseContactsInterface[]>([]);
  currentDate = signal<string>("2026-02-01");
  currentTask = signal<Task>({ id: 0, headline: "", desc: "", dueDate: "", priority: 1, category: "", assignedTo: [], subtasks: [], progressStatus: 'To do' });
  currentPrio = signal<number>(1);
  newSubtask = '';
  taskForm = new FormGroup({
    title: new FormControl('', { validators: [Validators.required, Validators.minLength(5)] }),
    desc: new FormControl(''),
    date: new FormControl('', { validators: [Validators.required] }),
    cat: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
    subtask: new FormControl('')
  });

  constructor(private taskService: TaskService, private supabase: Supabase) { }

  async ngOnInit() {
    const data = await this.supabase.getDataFromTable('users');
    if (data) {
      this.contacts.set(data);
    }
    this.subscripeAllInputFields();
    this.setCurrentDateAsMinValue();
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
    this.subtask.nativeElement.classList.add("d-none");
  }

  setCurrentDateAsMinValue() {
    this.currentDate.set(new Date().toISOString().split("T")[0]);
  }

  addSubtask() {
    if (this.newSubtask.trim()) {
      // this.subtasks.push(this.newSubtask);
      this.newSubtask = '';
    }
  }

  createTask() {
    const assignment: SupabaseContactsInterface[] = this.contactsSelector.selectedContacts;
    const data = {}
    this.resetForm();
  }

  resetForm() {
    this.currentTask.set({ id: 0, headline: "", desc: "", dueDate: "", priority: 1, category: "", assignedTo: [], subtasks: [], progressStatus: 'To do' });
  }
}
