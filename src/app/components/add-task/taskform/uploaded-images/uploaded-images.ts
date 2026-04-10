import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskFile } from '../../../../interfaces/taskmodel.interfaces';
import { FilenamePipe } from '../../../../pipes/filenamepipe';

@Component({
  selector: 'app-uploaded-images',
  imports: [FilenamePipe],
  templateUrl: './uploaded-images.html',
  styleUrl: './uploaded-images.scss',
})
export class UploadedImages {
  @Input() imageData!: TaskFile;
  @Output() delete = new EventEmitter<TaskFile>();

  deleteImage(event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit(this.imageData);
  }
}
