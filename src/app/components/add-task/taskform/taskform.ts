import { SupabaseContactsInterface } from './../../../interfaces/supabase.interfaces';
import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Supabase } from '../../../services/supabase';
import { OnInit } from '@angular/core';
import { ContactsSelectorWithSearch } from './contacts-selector-with-search/contacts-selector-with-search';

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
  closeDropdown() {
    this.contactsSelector?.closeOnOutsideClick();
  }
  currentDate = signal<string>("2026-02-01");
  title = '';
  description = '';
  dueDate = '';
  priority: 0 | 1 | 2 = 1;
  category = '';
  assignedTo: number[] = [];
  subtasks: string[] = [];
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

  subscripeAllInputFields(){
    this.taskForm.get('title')?.valueChanges.subscribe((value) => { this.title = value! });
    this.taskForm.get('desc')?.valueChanges.subscribe((value) => { this.description = value! });
    this.taskForm.get('date')?.valueChanges.subscribe((value) => { this.dueDate = value! });
    this.taskForm.get('cat')?.valueChanges.subscribe((value) => { this.category = value! });
  }

  setCurrentDateAsMinValue(){
    this.currentDate.set(new Date().toISOString().split("T")[0]);
  }

  toggleContact(id: number) {
    if (this.assignedTo.includes(id)) {
      this.assignedTo = this.assignedTo.filter(i => i !== id);
    } else {
      this.assignedTo.push(id);
    }
  }

  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtasks.push(this.newSubtask);
      this.newSubtask = '';
    }
  }

  test(){console.log('testing')}

  createTask() {

    const task = {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      category: this.category,
      assignedTo: this.assignedTo,
      subtasks: this.subtasks,
      status: 'todo'
    };

    this.taskService.addTask(task);
    this.resetForm();
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.priority = 1;
    this.category = '';
    this.assignedTo = [];
    this.subtasks = [];
    this.newSubtask = '';
  }
}
