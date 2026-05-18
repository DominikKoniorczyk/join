import { Subscription } from 'rxjs';
import { OpenFullimage } from '../../../../services/open-fullimage';
import { Task, TaskFile } from './../../../../interfaces/taskmodel.interfaces';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-details',
  imports: [],
  templateUrl: './image-details.html',
  styleUrl: './image-details.scss',
})
export class ImageDetails {
  @Input() ImagesData!: TaskFile[];
  @ViewChild("dialog") dialogRef!: ElementRef<HTMLDialogElement>;
  dialogService = inject(OpenFullimage);
  private subscription?: Subscription;

  FileData: string = "";
  Image: string = "";
  currentIndex: number = 0;

  ngOnInit(): void {
    this.subscription =
      this.dialogService.openDialog$
        .subscribe(() => {
          this.open();
        });
  }

  open() {
    this.ImagesData = this.dialogService.files();
    this.openDialog(this.dialogService.currentIndex());
    this.dialogRef.nativeElement.classList.add("open");
    this.dialogRef.nativeElement.showModal();
  }

  openDialog(index: number) {
    if (this.ImagesData) {
      const size = this.getBase64SizeInKB(this.ImagesData[index].base64 as string);
      this.FileData = this.ImagesData[index].filename + " / " + size + "KB";
      this.currentIndex = index;
      this.Image = this.ImagesData[index].base64 as string;
    }
  }

  cycleThrueImages(forward: boolean) {
    if (forward) {
      this.nextImage();
    }
    else {
      this.previousImage();
    }
  }

  nextImage() {
    if (this.ImagesData!.length > this.currentIndex + 1) {
      this.openDialog(this.currentIndex + 1);
    }
    else {
      this.openDialog(0);
    }
  }

  previousImage() {
    if (this.currentIndex - 1 >= 0) {
      this.openDialog(this.currentIndex - 1);
    }
    else {
      this.openDialog(this.ImagesData.length - 1);
    }
  }

  getBase64SizeInKB(base64: string): number {
    const cleanedBase64 = base64.includes(',')
      ? base64.split(',')[1]
      : base64;
    const padding = (cleanedBase64.match(/=*$/)?.[0].length ?? 0);
    const sizeInBytes =
      (cleanedBase64.length * 3) / 4 - padding;
    return Math.floor(sizeInBytes / 1024);
  }

  closeDialog() {
    this.dialogRef.nativeElement.classList.remove("open");
    this.dialogRef.nativeElement.classList.add("close");
    setTimeout(() => {
      this.dialogService.closeDialog();
      this.dialogRef.nativeElement.close();
    }, 1000);
  }

  downloadCurrentImage() {
    const link = document.createElement('a');
    link.href = this.ImagesData[this.currentIndex].base64 as string;
    link.download = this.ImagesData[this.currentIndex].filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  zoomOut() {

  }

  zoomIn() {

  }
}
