import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filenameFormat',
})
export class FilenamePipe implements PipeTransform {
  transform(value: string, limit: number = 11): string {
    if (!value) return '';
    const fileType = value.substring(value.lastIndexOf("."));
    if (value.length <= limit) return value;
    return value.substring(0, limit) + fileType;
  }
}
