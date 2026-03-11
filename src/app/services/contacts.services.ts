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

/**
 * Angular pipe that extracts initials from a full name.
 * Can return the first or last initial depending on the `position` argument.
 *
 * @example
 * {{ 'John Doe' | initialsSelector:1 }}  // Outputs: "J"
 * {{ 'John Doe' | initialsSelector:2 }}  // Outputs: "D"
 *
 * @param {string} fullName - The full name to extract initials from.
 * @param {number} [position] - Optional. 1 for first initial, 2 for last initial.
 * @returns {string} The uppercase initial based on the specified position, or empty string if unavailable.
 */
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
