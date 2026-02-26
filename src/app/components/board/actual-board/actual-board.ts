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


@Component({
  selector: 'app-actual-board',
  standalone: true,
  imports: [CommonModule, BoardCardsComponent, BoardCardsFull],
  templateUrl: './actual-board.html',
  styleUrl: './actual-board.scss',
})
export class ActualBoard {


  animService = inject(AnimationService);

  @ViewChild('cardDialog') cardDetails! : ElementRef;

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

  constructor(){
     this.supabaseChannel = this.supabaseClientService.supabaseClient.channel('custom-all-channel');
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

    resetTasks(){
      this.toDoTasksColumn.set([]);
      this.inProgressTasksColumn.set([]);
      this.awaitFeedbackTasksColumn.set([]);
      this.doneTasksColumn.set([]);
    }

    orderTasks(){
      this.dataTasks().forEach(el => {
        if(el.progressStatus === 'To do') this.orderTasksIntoTodo(el);
        else if(el.progressStatus === 'In progress') this.orderTasksIntoInProgress(el);
        else if(el.progressStatus === 'Await feedback') this.orderTasksIntoAwaitFeedback(el);
        else if(el.progressStatus === 'Done') this.orderTasksIntoDone(el);
      })
    }

    orderTasksIntoTodo(newElement: Task){
      this.toDoTasksColumn.update((el)=>{
        if(!el) return el;
        return [...el, newElement];
      })
    }

      orderTasksIntoInProgress(newElement: Task){
      this.inProgressTasksColumn.update((el)=>{
        if(!el) return el;
        return [...el, newElement];
      })
    }

        orderTasksIntoAwaitFeedback(newElement: Task){
      this.awaitFeedbackTasksColumn.update((el)=>{
        if(!el) return el;
        return [...el, newElement];
      })
    }

        orderTasksIntoDone(newElement: Task){
      this.doneTasksColumn.update((el)=>{
        if(!el) return el;
        return [...el, newElement];
      })
    }




  async openDialog(task: Task){
    this.selectedTask = task;
    const dialogRef = this.cardDetails.nativeElement;
    dialogRef.showModal();
    await this.animService.animate(dialogRef, slideInAnimations, 400, true)
  }

  async closeDialog(){
    const dialogRef = this.cardDetails.nativeElement;
    await this.animService.animate(dialogRef, slideOutAnimations, 300, true)
    dialogRef.close();
  }

  dummyTask: Task = {
    id: 1,
    progressStatus: 'To do',
    category: 'User Story',
    headline: 'Kochwelt & Recipe Recommender',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum ut soluta aliquam deleniti maxime, in itaque est tempore possimus sed consectetur obcaecati et laudantium quia, exercitationem sint sapiente molestias temporibus.',
    dueDate: '10/05/2023',
    priority: 2,
    assignedTo: [],
    subtasks: [
      {id:1, title:'Implement Recipe Recommendation', isDone:true},
      {id:2, title:'Start Page Layout', isDone:false }
    ]
  };


}
