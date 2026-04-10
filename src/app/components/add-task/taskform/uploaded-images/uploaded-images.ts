import { Component, Input } from '@angular/core';
import { TaskFile } from '../../../../interfaces/taskmodel.interfaces';

@Component({
  selector: 'app-uploaded-images',
  imports: [],
  templateUrl: './uploaded-images.html',
  styleUrl: './uploaded-images.scss',
})
export class UploadedImages {
  @Input() imageData!: TaskFile;
}
