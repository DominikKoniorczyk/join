import { Task } from './../../../../interfaces/taskmodel.interfaces';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-details',
  imports: [],
  templateUrl: './image-details.html',
  styleUrl: './image-details.scss',
})
export class ImageDetails {

  @Input() ImagesData! :Task;

  FileData :string = "";
  Image: string = "";
  currentIndex :number = 0;

  openDialog(index :number){
    if(this.ImagesData){
      const size = this.getBase64SizeInKB(this.ImagesData.files[index].base64 as string);
      this.FileData = this.ImagesData.files[index].filename + "" + size;
      this.currentIndex = index;
      this.Image = this.ImagesData.files[index].base64 as string;
    }
  }

  cycleThrueImages(forward: boolean){
    if(forward){
      this.nextImage();
    }
    else{
      this.previousImage();
    }
  }

  nextImage(){
    if(this.ImagesData!.files.length > this.currentIndex + 1){
      this.openDialog(this.currentIndex + 1);
    }
    else{
      this.openDialog(0);
    }
  }

  previousImage(){
    if(this.currentIndex - 1 >= 0){
      this.openDialog(this.currentIndex - 1);
    }
    else{
      this.openDialog(this.ImagesData.files.length);
    }
  }

  getBase64SizeInKB(base64: string): number {
    const cleanedBase64 = base64.includes(',')
      ? base64.split(',')[1]
      : base64;
    const padding = (cleanedBase64.match(/=*$/)?.[0].length ?? 0);
    const sizeInBytes =
      (cleanedBase64.length * 3) / 4 - padding;
    return sizeInBytes / 1024;
  }

  closeDialog(){

  }

  downloadCurrentImage(){
    const link = document.createElement('a');
    link.href = this.ImagesData.files[this.currentIndex].base64 as string;
    link.download = this.ImagesData.files[this.currentIndex].filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  zoomOut(){

  }

  zoomIn(){

  }
}
