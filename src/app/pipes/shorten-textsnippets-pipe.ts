import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenTextsnippets',
})
export class ShortenTextsnippetsPipe implements PipeTransform {

  transform(value: string, limit: number = 35): string {
    if(!value) return '';
    if(value.length <= limit) return value;
    return value.substring(0,limit)+ '...';
  }

}
