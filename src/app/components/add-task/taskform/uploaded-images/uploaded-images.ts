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
  @Input() Download: boolean = false;
  @Output() delete = new EventEmitter<TaskFile>();

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

    }
  }
}
