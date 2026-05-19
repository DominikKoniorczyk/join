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
}
