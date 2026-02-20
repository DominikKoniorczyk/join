import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Supabase } from '../../../services/supabase';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-taskform',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taskform.html',
  styleUrls: ['./taskform.scss']
})
export class TaskformComponent implements OnInit {

 @Input() contacts: any[] = [];

  title = '';
  description = '';
  dueDate = '';
  priority: 'urgent' | 'medium' | 'low' = 'medium';
  category = '';

  assignedTo: number[] = [];

  subtasks: string[] = [];
  newSubtask = '';

 constructor(
  private taskService: TaskService,
  private supabase: Supabase
) {}
async ngOnInit() {
  const data = await this.supabase.getDataFromTable('contacts');
  if (data) {
    this.contacts = data;
  }
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

  isValid() {
    return this.title.trim() !== '' && this.dueDate !== '';
  }

  createTask() {
    if (!this.isValid()) return;

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
    this.priority = 'medium';
    this.category = '';
    this.assignedTo = [];
    this.subtasks = [];
    this.newSubtask = '';
  }
}