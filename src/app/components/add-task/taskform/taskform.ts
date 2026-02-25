import { SupabaseContactsInterface } from './../../../interfaces/supabase.interfaces';
import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Supabase } from '../../../services/supabase';
import { OnInit } from '@angular/core';
import { ContactsSelectorWithSearch } from './contacts-selector-with-search/contacts-selector-with-search';
import { Task } from '../../../interfaces/task.interface';

@Component({
  selector: 'app-taskform',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ContactsSelectorWithSearch],
  templateUrl: './taskform.html',
  styleUrls: ['./taskform.scss']
})
export class TaskformComponent implements OnInit {
  contacts = signal<SupabaseContactsInterface[]>([]);
  @ViewChild('contactsSelector') contactsSelector!: ContactsSelectorWithSearch;
  currentDate = signal<string>("2026-02-01");
  currentTask = signal<Task>({id: "", title: "", description: "", dueDate: "", priority: 0 , category: "", assignedTo: [], subtasks: [], status: 'todo'});
  newSubtask = '';
  taskForm = new FormGroup({
      title: new FormControl('', { validators: [Validators.required, Validators.minLength(5)]}),
      desc: new FormControl(''),
      date: new FormControl('', { validators: [Validators.required]}),
      cat: new FormControl('', { validators: [Validators.required, Validators.minLength(1)]}),
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

  subscripeAllInputFields(){
    // this.taskForm.get('title')?.valueChanges.subscribe((value) => { this.currentTask.title = value! });
    // this.taskForm.get('desc')?.valueChanges.subscribe((value) => { this.currentTask.description = value! });
    // this.taskForm.get('date')?.valueChanges.subscribe((value) => { this.currentTask.dueDate = value! });
    // this.taskForm.get('cat')?.valueChanges.subscribe((value) => { this.currentTask.category = value! });
  }

  setCurrentDateAsMinValue(){
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
    this.currentTask.set({id: "", title: "", description: "", dueDate: "", priority: 0 , category: "", assignedTo: [], subtasks: [], status: 'todo' });
  }
}
