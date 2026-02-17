import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  constructor() {}

  transform(fullName: string): string {
    return fullName
      .trim()
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }
}
