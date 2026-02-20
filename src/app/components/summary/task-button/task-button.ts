import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskformComponent } from '../../add-task/taskform/taskform';
import { Supabase } from '../../../services/supabase';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-task-button',
  standalone: true,
  imports: [CommonModule, TaskformComponent],
  templateUrl: './task-button.html'
})
export class TaskButtonComponent implements OnInit {
  contacts: any[] = [];

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    const data = await this.supabase.getDataFromTable('contacts');
    if (data) {
      this.contacts = data;
    }
  }
}