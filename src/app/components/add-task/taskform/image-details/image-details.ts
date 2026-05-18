import { Subscription } from 'rxjs';
import { OpenFullimage } from '../../../../services/open-fullimage';
import { TaskFile } from './../../../../interfaces/taskmodel.interfaces';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { AnimationService } from '../../../../services/animation.service';
import { imageSlideInAnimations, imageSlideOutAnimations } from '../../../board/animations-board/dialog.animation';

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
  zoom = 1;
  translateX = 0;
  translateY = 0;
  transform = '';

  constructor(private animService: AnimationService) { }

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
    this.dialogRef.nativeElement.showModal();
    this.animService.animate(this.dialogRef.nativeElement, imageSlideInAnimations, 300, true);
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
    this.animService.animate(this.dialogRef.nativeElement, imageSlideOutAnimations, 300, true);
    setTimeout(() => {
      this.dialogService.closeDialog();
      this.dialogRef.nativeElement.close();
    }, 300);
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
    this.zoom = Math.max(
      this.zoom - 0.5,
      1
    );
  }

  zoomIn() {
    this.zoom = Math.min(
      this.zoom + 0.5,
      3
    );
  }

  updateTransform(): void {
    this.transform =
      `translate(-50%, -50%)
     translate(${this.translateX}px, ${this.translateY}px)
     scale(${this.zoom})`;
  }
}
