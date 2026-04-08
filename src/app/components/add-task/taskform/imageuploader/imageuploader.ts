import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-imageuploader',
  imports: [],
  templateUrl: './imageuploader.html',
  styleUrl: './imageuploader.scss',
})
export class Imageuploader {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadArea') uploadArea!: ElementRef<HTMLDivElement>;

  allEventsForDrop: string[] = ['dragenter', 'dragover', 'dragleave', 'drop'];

  triggerFilePicker() {
    this.fileInput.nativeElement.click();
  }

  preventDefaults(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragOver(event: DragEvent) {
    this.uploadArea.nativeElement.classList.add("dragover");
    this.preventDefaults(event);
  }

  handleDragLeave(event: DragEvent) {
    this.uploadArea.nativeElement.classList.remove("dragover");
    this.preventDefaults(event);
  }

  handleDrop(event: DragEvent) {
    this.handleDragLeave(event);
    const data = event.dataTransfer;
    const files = data!.files;
    const dataTransfer = new DataTransfer();
    if (files.length > 0) {
      this.getCurrentFiles(dataTransfer);
      this.getNewFiles(dataTransfer, files);
      this.fileInput.nativeElement.files = dataTransfer.files;
    }
  }

  getCurrentFiles(dataTransfer: DataTransfer) {
    const currentFiles = this.fileInput.nativeElement.files;
    if (currentFiles) {
      for (let i = 0; i < currentFiles.length; i++) {
        dataTransfer.items.add(currentFiles[i]);
      }
    }
  }

  getNewFiles(dataTransfer: DataTransfer, files: FileList) {
    for (let i = 0; i < files.length; i++) {
      dataTransfer.items.add(files[i]);
    }
  }
}
