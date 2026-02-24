import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActualBoard } from './actual-board/actual-board';
import { BoardNav } from './board-nav/board-nav';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, ActualBoard, BoardNav],
  templateUrl: './board.html',
  styleUrls: ['./board.scss']
})
export class Board implements OnInit {

  todo: any[] = [];
  inprogress: any[] = [];
  await: any[] = [];
  done: any[] = [];

  selectedTask: any = null;
  isEditing: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadTasks();


    this.route.queryParams.subscribe(params => {
      const status = params['status'];
      if (status) {
        setTimeout(() => {
          const el = document.getElementById(status);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    });
  }

  loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    this.todo = tasks.filter((t: any) => t.status === 'todo');
    this.inprogress = tasks.filter((t: any) => t.status === 'inprogress');
    this.await = tasks.filter((t: any) => t.status === 'await');
    this.done = tasks.filter((t: any) => t.status === 'done');
  }


  drop(event: CdkDragDrop<any[]>, status: string) {


    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = status;
    }


    const allTasks = [
      ...this.todo,
      ...this.inprogress,
      ...this.await,
      ...this.done
    ];

    localStorage.setItem('tasks', JSON.stringify(allTasks));
  }


  openAddTask() {
    this.router.navigate(['/add-task']);
  }


  openTask(task: any) {
    this.selectedTask = task;
    this.isEditing = false;
  }


  closeTask() {
    this.selectedTask = null;
    this.isEditing = false;
  }


  deleteTask(task: any) {
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    tasks = tasks.filter((t: any) => t.id !== task.id);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.closeTask();
    this.loadTasks();
  }

  editTask(task: any) {
    this.selectedTask = { ...task };
    this.isEditing = true;
  }


  saveTask() {
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    const index = tasks.findIndex((t: any) => t.id === this.selectedTask.id);

    if (index !== -1) {
      tasks[index] = this.selectedTask;
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

    this.isEditing = false;
    this.closeTask();
    this.loadTasks();
  }


  saveSubtasks() {
    const allTasks = [
      ...this.todo,
      ...this.inprogress,
      ...this.await,
      ...this.done
    ];

    localStorage.setItem('tasks', JSON.stringify(allTasks));
  }
}
