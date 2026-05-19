import { TaskFile } from './../../../../interfaces/taskmodel.interfaces';
import { Component, ElementRef, Input, ViewChild, inject, signal } from '@angular/core';
import { UploadedImages } from '../uploaded-images/uploaded-images';
import { Supabase } from '../../../../services/supabase';
import { Base64Service } from '../../../../services/base64-service';

@Component({
  selector: 'app-imageuploader',
  imports: [UploadedImages],
  templateUrl: './imageuploader.html',
  styleUrl: './imageuploader.scss',
})
export class Imageuploader {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadArea') uploadArea!: ElementRef<HTMLDivElement>;
  @Input() Download: boolean = false;
  @Input() files!: TaskFile[];

  allEventsForDrop: string[] = ['dragenter', 'dragover', 'dragleave', 'drop'];
  allImages: TaskFile[] = [];
  imagesInInputField!: FileList;
  images = signal<TaskFile[]>([]);
  supabase = inject<Supabase>;

  constructor(private fileService: Base64Service) { }

  /**
   * Angular lifecycle hook that initializes the component state.
   *
   * Sets the internal image signal with the provided file list,
   * stores a backup reference of all images, and populates the
   * internal input file collection with the initial files.
   *
   * @returns {void}
   */
   ngOnInit() {
    this.images.set(this.files);
    this.allImages = this.files;
    this.addFilesInitialy();
  }

  /**
   * Creates a new {@link DataTransfer} object and fills it with
   * the currently available files converted from Base64 strings.
   *
   * The generated {@link FileList} is assigned to the internal
   * input field representation to simulate initially selected files.
   *
   * @returns {void}
   */
   addFilesInitialy() {
    const dataTransfer = new DataTransfer();
    for (let i = 0; i < this.files.length; i++) {
      dataTransfer.items.add(this.fileService.base64ToFile(this.files[i].base64 as string, this.files[i].filename));
    }
    this.imagesInInputField = dataTransfer.files;
  }

  /**
   * Triggers the hidden file input element to open the native file picker dialog.
   */
   triggerFilePicker() {
    this.fileInput.nativeElement.click();
  }

  /**
   * Prevents default browser behavior and stops event propagation.
   *
   * @param {Event} event - The DOM event to prevent.
   */
   preventDefaults(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Handles the dragover event for the upload area.
   * Adds visual feedback and prevents default browser behavior.
   *
   * @param {DragEvent} event - The drag event.
   */
   handleDragOver(event: DragEvent) {
    this.uploadArea.nativeElement.classList.add("dragover");
    this.preventDefaults(event);
  }

  /**
   * Handles the dragleave event for the upload area.
   * Removes visual feedback and prevents default browser behavior.
   *
   * @param {DragEvent} event - The drag event.
   */
   handleDragLeave(event: DragEvent) {
    this.uploadArea.nativeElement.classList.remove("dragover");
    this.preventDefaults(event);
  }

  /**
   * Handles dropped files from a drag & drop interaction.
   * Extracts files from the DataTransfer object and adds them to the file list.
   *
   * @param {DragEvent} event - The drop event.
   * @returns {Promise<void>}
   */
   async handleDrop(event: DragEvent) {
    this.handleDragLeave(event);
    const data = event.dataTransfer;
    const files = data!.files;
    if (files.length > 0) {
      this.addNewFilesToList(files);
    }
  }

  /**
   * Merges newly selected files with existing ones and updates the internal file list.
   * Also triggers image processing for the updated file set.
   *
   * @param {FileList} newFiles - Newly selected or dropped files.
   */
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

  /**
   * Handles file input change events and adds selected files to the list.
   *
   * @param {Event} event - The input change event.
   */
   onFilesChanged(event: Event) {
    const currentFiles = this.fileInput.nativeElement.files;
    if (currentFiles) {
      this.addNewFilesToList(currentFiles);
    }
  }

  /**
   * Converts valid image files (JPEG/PNG) into compressed Base64 objects
   * and stores them in the component state.
   *
   * @param {FileList} currentFiles - The list of selected files.
   * @returns {Promise<void>}
   */
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
   * Compressing an image to the target size or quality
   * @param {File} file - Files which have to be compressed
   * @param {number} maxWidth - The maximum width of the final picture
   * @param {number} maxHeight - The maximum height of the final picture
   * @param {number} quality - Quality of the compressed picture (value between 0 and 1)
   * @returns {Promise<string>} - Base64-String of the final picture
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

  /**
   * Creates a compressed image using a canvas element.
   * The image is resized to fit within the given max width and height
   * while maintaining its aspect ratio, then exported as a JPEG data URL.
   *
   * @param {HTMLImageElement} img - The source image element.
   * @param {number} maxWidth - Maximum allowed width for compression.
   * @param {number} maxHeight - Maximum allowed height for compression.
   * @param {number} quality - JPEG quality factor (0 to 1).
   * @returns {string} A base64-encoded JPEG image string.
   */
   createCanvasForCompressing(img: HTMLImageElement, maxWidth: number, maxHeight: number, quality: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let dimensions = this.getDimensionsForCompression(img.width, maxWidth, img.height, maxHeight);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx!.drawImage(img, 0, 0, dimensions.width, dimensions.height);
    return canvas.toDataURL('image/jpeg', quality);
  }

  /**
   * Calculates scaled dimensions for image compression while preserving aspect ratio.
   * Ensures the image fits within the provided maximum width and height constraints.
   *
   * @param {number} width - Original image width.
   * @param {number} maxWidth - Maximum allowed width.
   * @param {number} height - Original image height.
   * @param {number} maxHeight - Maximum allowed height.
   * @returns {{ width: number, height: number }} The calculated dimensions.
   */
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

  /**
   * Removes a file from the internal image list and synchronizes it with the file input state.
   * Updates both the stored image array and the DataTransfer-backed input field.
   *
   * @param {TaskFile} file - The file to be removed.
   */
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

  /**
   * Removes all currently stored files and resets the internal state.
   * Clears the complete image collection, updates the image signal,
   * and resets the internal input file list by assigning an empty
   *
   * @returns {void}
   */
   deleteAllFiles(){
    const dataTransfer = new DataTransfer();
    this.allImages = [];
    this.images.set([]);
    this.imagesInInputField = dataTransfer.files;
  }
}
