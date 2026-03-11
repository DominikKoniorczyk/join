import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenTextsnippets',
})

/**
 * Angular pipe that shortens a text string to a specified character limit
 * and appends an ellipsis if the text exceeds that limit.
 */
export class ShortenTextsnippetsPipe implements PipeTransform {

  /**
   * Transforms a string by truncating it to the specified limit.
   *
   * @param {string} value - The original string to shorten.
   * @param {number} [limit=35] - The maximum number of characters allowed before truncation.
   * @returns {string} The shortened string with '...' appended if truncated.
   */
  transform(value: string, limit: number = 35): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit) + '...';
  }
}
