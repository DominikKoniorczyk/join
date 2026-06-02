import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Base64Service {

  base64ToFile(base64: string, fileName: string): File {
    const header = base64.split(',');
    const typeMatch = header[0].match(/:(.*?);/);
    const type = typeMatch ? typeMatch[1] : 'image/png';
    const headerEnd = atob(header[1]);
    let i = headerEnd.length;
    const file = new Uint8Array(i);
    while (i--) {
      file[i] = headerEnd.charCodeAt(i);
    }
    return new File([file], fileName,{ type: type });
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
   * Converts valid image files (JPEG/PNG) into compressed Base64 objects
   * and stores them in the component state.
   *
   * @param {FileList} currentFiles - The list of selected files.
   * @returns {results | null} compressedFiles - The blob data.
   */
   async createBlob(currentFiles: FileList){
    if(!currentFiles) return null;
    const files = Array.from(currentFiles);
    const validFiles = files.filter(file =>
      file.type === 'image/jpeg' || file.type === 'image/png');
    const results = [];
    for (const file of validFiles) {
      const compressedBase64 = await this.compressImage(file, 800, 800, 0.8);
      results.push({ filename: file.name, filetype: file.type, base64: compressedBase64 });
    }
    return results;
  }
}
