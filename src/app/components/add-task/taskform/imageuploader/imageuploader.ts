import { TaskFile } from './../../../../interfaces/taskmodel.interfaces';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { UploadedImages } from '../uploaded-images/uploaded-images';

@Component({
  selector: 'app-imageuploader',
  imports: [UploadedImages],
  templateUrl: './imageuploader.html',
  styleUrl: './imageuploader.scss',
})
export class Imageuploader {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadArea') uploadArea!: ElementRef<HTMLDivElement>;

  allEventsForDrop: string[] = ['dragenter', 'dragover', 'dragleave', 'drop'];
  allImages: TaskFile[] = [];
  imagesInInputField!: FileList;

  images = signal<TaskFile[]>([]);

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

  async handleDrop(event: DragEvent) {
    this.handleDragLeave(event);
    const data = event.dataTransfer;
    const files = data!.files;
    if (files.length > 0) {
      this.addNewFilesToList(files);
    }
  }

  addNewFilesToList(newFiles: FileList) {
    const dataTransfer = new DataTransfer();
    if (this.imagesInInputField) {
      for (let i = 0; i < this.imagesInInputField.length; i++) {
        dataTransfer.items.add(this.imagesInInputField[i]);
      }
    }
    for (let i = 0; i < newFiles.length; i++) {
      dataTransfer.items.add(newFiles[i]);
    }
    this.imagesInInputField = dataTransfer.files;
    this.createBlob(this.imagesInInputField);
  }

  onFilesChanged(event: Event) {
    const currentFiles = this.fileInput.nativeElement.files;
    if (currentFiles) {
      this.addNewFilesToList(currentFiles);
    }
  }

  async createBlob(currentFiles: FileList) {
    if (!currentFiles) return;
    const files = Array.from(currentFiles);
    const validFiles = files.filter(file =>
      file.type === 'image/jpeg' || file.type === 'image/png'
    );
    const results = [];
    for (const file of validFiles) {
      const compressedBase64 = await this.compressImage(file, 800, 800, 0.8);
      results.push({ filename: file.name, filetype: file.type, base64: compressedBase64 });
    }
    this.allImages = results;
    this.images.set([...results]);
  }

  /**
   * Komprimiert ein Bild auf eine Zielgröße oder -qualität
   * @param {File} file - Die Bilddatei, die komprimiert werden soll
   * @param {number} maxWidth - Die maximale Breite des Bildes
   * @param {number} maxHeight - Die maximale Höhe des Bildes
   * @param {number} quality - Qualität des komprimierten Bildes (zwischen 0 und 1)
   * @returns {Promise<string>} - Base64-String des komprimierten Bildes
   */
  compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const img = new Image();
          img.onload = () => {
            const compressedBase64 = this.createCanvasForCompressing(img, maxWidth, maxHeight, quality);
            resolve(compressedBase64);
          };
          img.onerror = () => reject('Error on loading the image.');
          img.src = result;
        } else reject('Unknown result.');
      };
      reader.onerror = () => reject('Error while reading the data.');
      reader.readAsDataURL(file);
    });
  }

  createCanvasForCompressing(img: HTMLImageElement, maxWidth: number, maxHeight: number, quality: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let dimensions = this.getDimensionsForCompression(img.width, maxWidth, img.height, maxHeight);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx!.drawImage(img, 0, 0, dimensions.width, dimensions.height);
    return canvas.toDataURL('image/jpeg', quality);
  }

  getDimensionsForCompression(width: number, maxWidth: number, height: number, maxHeight: number) {
    if (width > maxWidth || height > maxHeight) {
      if (width > height) {
        return { height: (height * maxWidth) / width, width: maxWidth };
      } else {
        return { width: (width * maxHeight) / height, height: maxHeight };
      }
    }
    else return { width: width, height: height };
  }

  findAndDeleteFile(file: TaskFile) {
    const index = this.allImages.findIndex(img => img.filename === file.filename);
    if (index !== -1) {
      this.allImages.splice(index, 1);
      this.images.set(this.allImages);
      const dataTransfer = new DataTransfer();
      for (let i = 0; i < this.imagesInInputField.length; i++) {
        if (this.imagesInInputField[i].name !== file.filename) {
          dataTransfer.items.add(this.imagesInInputField[i]);
        }
      }
      this.imagesInInputField = dataTransfer.files;
    }
  }
}
