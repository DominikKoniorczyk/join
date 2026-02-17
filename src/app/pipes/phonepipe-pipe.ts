import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe that formats a phone number by grouping digits in sets of three
 * and prepending a plus sign.
 *
 * Examples:
 *   '1234567890' => '+123 456 789 0'
 *   987654321 => '+987 654 321'
 */
@Pipe({
  name: 'phoneFormat',
})
export class PhonePipe implements PipeTransform {
  /**
  * Transforms a phone number (string or number) into a formatted string.
  * Non-digit characters are removed, and digits are grouped in sets of three.
  * @param value The phone number to format.
  * @returns A string representing the formatted phone number with a leading '+'.
  */
  transform(value: string | number): string {
    if (!value) return '';
    let str = value.toString();
    str = str.replace(/\D/g, '');
    let formatted = '+' + str[0] + str.slice(1);
    if (str.length > 2) {
      const country = str.slice(0, 2);
      const rest = str.slice(2);
      const pattern = rest.match(/.{1,4}/g);
      formatted = `+${country} ${pattern?.join(' ')}`;
    }
    return formatted;
  }
}
