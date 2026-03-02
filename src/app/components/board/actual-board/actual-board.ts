import { Supabase } from './../../../services/supabase';
import { Component, ElementRef, inject, Input, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCardsComponent } from './board-cards/board-cards';
import { BoardCardsFull } from './board-cards-full/board-cards-full';
import { Dialog } from '@angular/cdk/dialog';
import { AnimationService } from '../../../services/animation.service';
import { slideInAnimations, slideOutAnimations } from '../animations-board/dialog.animation';
import { Task } from '../../../interfaces/taskmodel.interfaces';
import { ContactsSelectorWithSearch } from '../../add-task/taskform/contacts-selector-with-search/contacts-selector-with-search';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskformComponent } from '../../add-task/taskform/taskform';


@Component({
  selector: 'app-actual-board',
  standalone: true,
  imports: [CommonModule, BoardCardsComponent, BoardCardsFull, DragDropModule],
  templateUrl: './actual-board.html',
  styleUrl: './actual-board.scss',
})

export class ActualBoard {
  @Input() searchTerm: string = '';

  animService = inject(AnimationService);

  @ViewChild('cardDialog') cardDetails!: ElementRef;
  @ViewChild('cardData') cardData!: BoardCardsFull;
  @ViewChild('addTaksDialog') addTask!: ElementRef;
  @ViewChild('cardTaskData') cardTaskData!: TaskformComponent;

  dataTasks = signal<Task[]>([]);

  selectedTask?: Task;
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  awaitFeedbackTasks: Task[] = [];
  doneTasks: Task[] = [];

  supabaseClientService = inject(Supabase);
  supabaseChannel: RealtimeChannel;

  toDoTasksColumn = signal<Task[]>([]);
  inProgressTasksColumn = signal<Task[]>([]);
  awaitFeedbackTasksColumn = signal<Task[]>([]);
  doneTasksColumn = signal<Task[]>([]);

  constructor() {
    this.supabaseChannel = this.supabaseClientService.supabaseClient.channel('custom-all-channel');
    this.getTasksData();
  }

  ngOnInit(): void {
    this.supabaseChannel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        this.getTasksData();
      })
      .subscribe();
  }

  async getTasksData() {
    const data = (await this.supabaseClientService.getDataFromTable(
      'tasks',
    )) as Task[];
    this.dataTasks.set(data);
    this.resetTasks();
    this.orderTasks();
  }

  resetTasks() {
    this.toDoTasksColumn.set([]);
    this.inProgressTasksColumn.set([]);
    this.awaitFeedbackTasksColumn.set([]);
    this.doneTasksColumn.set([]);
  }

  orderTasks() {
    this.dataTasks().forEach(el => {
      if (el.progressStatus === 'To do') this.orderTasksIntoTodo(el);
      else if (el.progressStatus === 'In progress') this.orderTasksIntoInProgress(el);
      else if (el.progressStatus === 'Await feedback') this.orderTasksIntoAwaitFeedback(el);
      else if (el.progressStatus === 'Done') this.orderTasksIntoDone(el);
    })
  }

  orderTasksIntoTodo(newElement: Task) {
    this.toDoTasksColumn.update((el) => {
      if (!el) return el;
      return [...el, newElement];
    })
  }

  orderTasksIntoInProgress(newElement: Task) {
    this.inProgressTasksColumn.update((el) => {
      if (!el) return el;
      return [...el, newElement];
    })
  }

  orderTasksIntoAwaitFeedback(newElement: Task) {
    this.awaitFeedbackTasksColumn.update((el) => {
      if (!el) return el;
      return [...el, newElement];
    })
  }

  orderTasksIntoDone(newElement: Task) {
    this.doneTasksColumn.update((el) => {
      if (!el) return el;
      return [...el, newElement];
    })
  }

  private matches(task: Task, term: string): boolean {
    const title = (task.headline || '').toLowerCase();
    const desc = (task.desc || '').toLowerCase();
    return title.includes(term) || desc.includes(term);
  }

  get filteredTodo(): Task[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const list = this.toDoTasksColumn();
    if (!term) return list;
    return list.filter(t => this.matches(t, term));
  }

  get filteredInProgress(): Task[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const list = this.inProgressTasksColumn();
    if (!term) return list;
    return list.filter(t => this.matches(t, term));
  }

  get filteredAwaitFeedback(): Task[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const list = this.awaitFeedbackTasksColumn();
    if (!term) return list;
    return list.filter(t => this.matches(t, term));
  }

  get filteredDone(): Task[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const list = this.doneTasksColumn();
    if (!term) return list;
    return list.filter(t => this.matches(t, term));
  }

  get noSearchResults(): boolean {
    const term = (this.searchTerm || '').trim();
    if (!term) return false;
    return (
      this.filteredTodo.length === 0 &&
      this.filteredInProgress.length === 0 &&
      this.filteredAwaitFeedback.length === 0 &&
      this.filteredDone.length === 0
    );
  }

  async openDialog(task: Task) {
    this.selectedTask = task;
    const dialogRef = this.cardDetails.nativeElement;
    this.cardData.initModal(task);
    dialogRef.showModal();
    await this.animService.animate(dialogRef, slideInAnimations, 400, true);
  }

  async closeDialog() {
    const dialogRef = this.cardDetails.nativeElement;
    await this.animService.animate(dialogRef, slideOutAnimations, 300, true);
    dialogRef.close();
  }

  async openAddTask(type: string) {
    console.log("Open");

    const dialogRef = this.addTask.nativeElement;
    this.cardTaskData.progress = type;
    dialogRef.showModal();
    await this.animService.animate(dialogRef, slideInAnimations, 400, true);
  }

  async closeAddTaskDialog() {
    const dialogRef = this.addTask.nativeElement;
    await this.animService.animate(dialogRef, slideOutAnimations, 300, true);
    dialogRef.close();
  }
}
