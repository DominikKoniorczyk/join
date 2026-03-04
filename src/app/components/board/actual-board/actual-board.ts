import { Supabase } from './../../../services/supabase';
import { Component, ElementRef, EventEmitter, inject, Input, Output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCardsComponent } from './board-cards/board-cards';
import { BoardCardsFull } from './board-cards-full/board-cards-full';
import { AnimationService } from '../../../services/animation.service';
import { slideInAnimations, slideOutAnimations } from '../animations-board/dialog.animation';
import { Task } from '../../../interfaces/taskmodel.interfaces';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AddTaskDialog } from '../../add-task/taskform/add-task-dialog/add-task-dialog';


@Component({
  selector: 'app-actual-board',
  standalone: true,
  imports: [CommonModule, BoardCardsComponent, BoardCardsFull, DragDropModule, AddTaskDialog],
  templateUrl: './actual-board.html',
  styleUrl: './actual-board.scss',
})

export class ActualBoard {
  @Input() searchTerm: string = '';
  @Output() noSearchResult = new EventEmitter<boolean>();

  @ViewChild('cardDialog') cardDetails!: ElementRef;
  @ViewChild('cardData') cardData!: BoardCardsFull;
  @ViewChild('addTaksDialog') addTask!: ElementRef;
  @ViewChild('cardTaskData') cardTaskData!: AddTaskDialog;
  @ViewChildren(CdkDrag) allDrags!: QueryList<CdkDrag>;

  dataTasks = signal<Task[]>([]);
  animService = inject(AnimationService);
  notMobile = signal<boolean>(true);
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
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        'resize',
        this.resizeHandler.bind(this)
      );
    }
  }

  ngAfterViewInit() {
    this.allDrags.changes.subscribe(() => {
      this.updateDragStatus();
    });
    setTimeout(() => {this.setInnerWidthOnInit()}, 0);
  }

  setInnerWidthOnInit(){
    this.notMobile.set(window.innerWidth > 768);
    this.updateDragStatus();
  }

  updateDragStatus() {
    this.allDrags.forEach(drag => {
      drag.disabled = !this.notMobile();
    });
  }

  resizeHandler(event: any) {
    this.notMobile.set(event.target.width > 768);
    this.updateDragStatus();
  }

  ngOnInit(): void {
    this.supabaseChannel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        this.getTasksData();
      })
      .subscribe();
  }

  ngOnDestroy() {
    this.supabaseChannel.unsubscribe();
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
    if (!term || this.searchTerm == "") return false;
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
    const dialogRef = this.addTask.nativeElement;
    this.cardTaskData.setCurrentProgress(type);
    dialogRef.showModal();
    await this.animService.animate(dialogRef, slideInAnimations, 400, true);
  }

  async closeAddTaskDialog() {
    const dialogRef = this.addTask.nativeElement;
    await this.animService.animate(dialogRef, slideOutAnimations, 300, true);
    dialogRef.close();
  }

  async drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      let movedTask = event.container.data[event.currentIndex] as Task;
      const newStatus = event.container.id as Task['progressStatus'];
      movedTask.progressStatus = newStatus;
      this.supabaseClientService.updateRow("tasks", movedTask, movedTask.id);
    }
  }

}
