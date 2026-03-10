import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe that transforms a full name into its initials.
 *
 * Example:
 *   'John Doe' => 'JD'
 */
@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  constructor() {}

  transform(fullName: string): string {
    if(!fullName) return "";
    return fullName
      .trim()
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }
}

@Pipe({ name: 'initialsSelector' })
export class InitialsSelctorPipe implements PipeTransform {
  transform(fullName: string, position?: number): string {
    if (!fullName) return "";
    const parts = fullName.trim().split(' ').filter(p => p.length > 0);
    if (position === 1 && parts.length > 0) {
      return parts[0][0].toUpperCase();
    }
    if (position === 2 && parts.length > 1) {
      return parts[parts.length - 1][0].toUpperCase();
    }
    return "";
  }
}
