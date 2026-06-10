import { Supabase } from './../../../services/supabase';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, Output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCardsComponent } from './board-cards/board-cards';
import { BoardCardsFull } from './board-cards-full/board-cards-full';
import { AnimationService } from '../../../services/animation.service';
import { slideInAnimations, slideOutAnimations } from '../animations-board/dialog.animation';
import { Task } from '../../../interfaces/taskmodel.interfaces';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AddTaskDialog } from '../../add-task/taskform/add-task-dialog/add-task-dialog';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { Router } from '@angular/router';


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

  constructor(private cdr: ChangeDetectorRef, private router: Router) {
    this.supabaseChannel = this.supabaseClientService.supabaseClient.channel('custom-all-channel');
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        'resize',
        this.resizeHandler.bind(this)
      );
    }
  }

  /**
   * Angular lifecycle hook that runs after the component's view has been initialized.
   * Subscribes to changes in all draggable elements and sets initial inner width.
   */
   ngAfterViewInit() {
    this.allDrags.changes.subscribe(() => {
      this.updateDragStatus();
    });
    setTimeout(() => { this.setInnerWidthOnInit() }, 0);
  }

  /**
   * Sets the initial inner width and updates drag status based on screen size.
   */
   setInnerWidthOnInit() {
    this.notMobile.set(window.innerWidth > 768);
    this.updateDragStatus();
  }

  /**
   * Enables or disables all draggable elements based on the `notMobile` flag.
   */
   updateDragStatus() {
    this.allDrags?.forEach(drag => {
      drag.disabled = !this.notMobile();
    });
  }

  /**
   * Handles window resize events to update `notMobile` flag and draggable status.
   *
   * @param {any} event - The resize event containing the new width.
   */
   resizeHandler(event: any) {
    this.notMobile.set(event.target.width > 768);
    this.updateDragStatus();
  }

  /**
   * Angular lifecycle hook that runs after component initialization.
   * Subscribes to Supabase channel for task changes and fetches initial tasks.
   */
   ngOnInit(): void {
    this.supabaseChannel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        this.getTasksData();
      })
      .subscribe();
    this.getTasksData();
  }

  /**
   * Angular lifecycle hook that runs when the component is destroyed.
   * Unsubscribes from the Supabase channel.
   */
   ngOnDestroy() {
    this.supabaseChannel.unsubscribe();
  }

  /**
   * Fetches tasks from Supabase, updates local state, resets and orders tasks.
   */
   async getTasksData() {
    const data = (await this.supabaseClientService.getDataFromTable(
      'tasks',
    )) as Task[];
    this.dataTasks.set(data);
    this.resetTasks();
    this.orderTasks();
    this.cdr.detectChanges();
  }

  /**
   * Clears all task columns.
   */
   resetTasks() {
    this.toDoTasksColumn.set([]);
    this.inProgressTasksColumn.set([]);
    this.awaitFeedbackTasksColumn.set([]);
    this.doneTasksColumn.set([]);
  }

  /**
   * Orders tasks into their respective columns based on progress status.
   */
   orderTasks() {
    this.dataTasks().forEach(el => {
      if (el.progressStatus === 'To do') this.orderTasksIntoTodo(el);
      else if (el.progressStatus === 'In progress') this.orderTasksIntoInProgress(el);
      else if (el.progressStatus === 'Await feedback') this.orderTasksIntoAwaitFeedback(el);
      else if (el.progressStatus === 'Done') this.orderTasksIntoDone(el);
    })
  }

  /**
   * Adds a task to the "To do" column.
   *
   * @param {Task} newElement - Task to be added.
   */
   orderTasksIntoTodo(newElement: Task) {
    this.toDoTasksColumn.update((el) => {
      if (!el) return el;
      return [...el, newElement];
    })
  }

  /**
   * Adds a task to the "In progress" column.
   *
   * @param {Task} newElement - Task to be added.
   */
   orderTasksIntoInProgress(newElement: Task) {
    this.inProgressTasksColumn.update((el) => {
      if (!el) return el;
      return [...el, newElement];
    })
  }

  /**
   * Adds a task to the "Await feedback" column.
   *
   * @param {Task} newElement - Task to be added.
   */
   orderTasksIntoAwaitFeedback(newElement: Task) {
    this.awaitFeedbackTasksColumn.update((el) => {
      if (!el) return el;
      return [...el, newElement];
    })
  }

  /**
   * Adds a task to the "Done" column.
   *
   * @param {Task} newElement - Task to be added.
   */
   orderTasksIntoDone(newElement: Task) {
    this.doneTasksColumn.update((el) => {
      if (!el) return el;
      return [...el, newElement];
    })
  }

  /**
   * Checks if a task's title or description contains a search term.
   *
   * @param {Task} task - The task to check.
   * @param {string} term - The search term.
   * @returns {boolean} True if title or description includes the term.
   */
   private matches(task: Task, term: string): boolean {
    const title = (task.headline || '').toLowerCase();
    const desc = (task.desc || '').toLowerCase();
    return title.includes(term) || desc.includes(term);
  }

  /**
   * Returns filtered "To do" tasks based on search term.
   */
   get filteredTodo(): Task[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const list = this.toDoTasksColumn();
    if (!term) return list;
    return list.filter(t => this.matches(t, term));
  }

  /**
   * Returns filtered "In progress" tasks based on search term.
   */
   get filteredInProgress(): Task[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const list = this.inProgressTasksColumn();
    if (!term) return list;
    return list.filter(t => this.matches(t, term));
  }

  /**
   * Returns filtered "Await feedback" tasks based on search term.
   */
   get filteredAwaitFeedback(): Task[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const list = this.awaitFeedbackTasksColumn();
    if (!term) return list;
    return list.filter(t => this.matches(t, term));
  }

  /**
   * Returns filtered "Done" tasks based on search term.
   */
   get filteredDone(): Task[] {
    const term = (this.searchTerm || '').toLowerCase().trim();
    const list = this.doneTasksColumn();
    if (!term) return list;
    return list.filter(t => this.matches(t, term));
  }

  /**
   * Returns true if no tasks match the current search term across all columns.
   */
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

  /**
   * Opens a modal dialog to display task details.
   *
   * @param {Task} task - The task to display in the modal.
   */
   async openDialog(task: Task) {
    this.selectedTask = task;
    const dialogRef = this.cardDetails.nativeElement;
    this.cardData.initModal(task);
    dialogRef.showModal();
    await this.animService.animate(dialogRef, slideInAnimations, 400, true);
  }

  /**
   * Closes the task details modal dialog with animation.
   */
   async closeDialog() {
    const dialogRef = this.cardDetails.nativeElement;
    await this.animService.animate(dialogRef, slideOutAnimations, 300, true);
    dialogRef.close();
  }

  /**
   * Checks breakpoints for mobile.
   */
   checkIsMobileDevice():boolean{
    return window.innerWidth <= 768;
   }

  /**
   * Opens the "Add Task" modal dialog and sets the current progress type.
   *
   * @param {string} type - The progress type for the new task.
   */
   async openAddTask(type: string) {
    if(this.checkIsMobileDevice()) this.router.navigateByUrl('add-task');
    const dialogRef = this.addTask.nativeElement;
    this.cardTaskData.setCurrentProgress(type);
    dialogRef.showModal();
    await this.animService.animate(dialogRef, slideInAnimations, 400, true);
  }

  /**
   * Closes the "Add Task" modal dialog with animation.
   */
   async closeAddTaskDialog() {
    const dialogRef = this.addTask.nativeElement;
    await this.animService.animate(dialogRef, slideOutAnimations, 300, true);
    dialogRef.close();
  }

  /**
   * Handles drag-and-drop operations for tasks across columns.
   *
   * @param {CdkDragDrop<any[]>} event - The drag-and-drop event.
   */
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
