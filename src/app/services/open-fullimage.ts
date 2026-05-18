import { Subject } from 'rxjs';
import { TaskFile } from './../interfaces/taskmodel.interfaces';
import { EventEmitter, Injectable, Output, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenFullimage {

  files = signal<TaskFile[]>([]);
  open = signal<boolean>(false);
  currentIndex = signal<number>(0);
  private sourceFiles = new Subject<TaskFile[]>();
  openDialog$ = this.sourceFiles.asObservable();

  @Output() Test = new EventEmitter<void>();

  openDialog(taskFiles: TaskFile[], index: number){
    this.currentIndex.set(index);
    this.files.set(taskFiles);
    this.open.set(true);
    this.Test.emit();
    this.sourceFiles.next(this.files());
  }

  openFile(){}

  closeDialog(){
    this.currentIndex.set(0);
    this.files.set([]);
    this.open.set(false);
  }
}
