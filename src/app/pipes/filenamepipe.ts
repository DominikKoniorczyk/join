import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe that formats a filename by truncating its base name
 * while preserving the file extension.
 *
 * Example:
 * "verylongfilename.pdf" → "verylongfi.pdf"
 */
  @Pipe({
  name: 'filenameFormat',
 })
 export class FilenamePipe implements PipeTransform {
  /**
   * Transforms a filename into a shortened version while keeping its extension.
   *
   * @param {string} value - The original filename.
   * @param {number} limit - Maximum length of the filename before truncation (default: 11).
   * @returns {string} The formatted filename.
   */
    transform(value: string, limit: number = 11): string {
    if (!value) return '';
    const fileType = value.substring(value.lastIndexOf("."));
    if (value.length <= limit) return value;
    return value.substring(0, limit) + fileType;
  }
}
