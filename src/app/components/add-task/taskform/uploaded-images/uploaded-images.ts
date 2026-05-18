import { OpenFullimage } from './../../../../services/open-fullimage';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Task, TaskFile } from '../../../../interfaces/taskmodel.interfaces';
import { FilenamePipe } from '../../../../pipes/filenamepipe';

@Component({
  selector: 'app-uploaded-images',
  imports: [FilenamePipe],
  templateUrl: './uploaded-images.html',
  styleUrl: './uploaded-images.scss',
})
export class UploadedImages {
  @Input() taskData!: Task;
  @Input() imageData!: TaskFile;
  @Input() Download: boolean = false;
  @Output() delete = new EventEmitter<TaskFile>();

  imageService = inject(OpenFullimage);

  deleteImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit(this.imageData);
  }

  downloadImage(event: Event): void {
    const link = document.createElement('a');
    link.href = this.imageData.base64 as string;
    link.download = this.imageData.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openFullImage() {
    if (this.Download) {
      this.imageService.openDialog(this.taskData.files, this.findImageIndex());
    }
  }

  findImageIndex(): number{
    let index = 0;
    for(let i = 0; i < this.taskData.files.length; i++){
      if(this.taskData.files[i].base64 === this.imageData.base64){
        index = i;
      }
    }
    return index;
  }
}
