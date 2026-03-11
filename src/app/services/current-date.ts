import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrentDate {
  /**
   * Returns the current date in ISO format (YYYY-MM-DD).
   *
   * @returns {string} The current date as a string in "YYYY-MM-DD" format.
   */
  getCurrentDate(): string {
    return new Date().toISOString().split("T")[0];
  }
}
