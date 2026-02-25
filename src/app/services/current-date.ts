import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrentDate {

  getCurrentDate(): string {
    return new Date().toISOString().split("T")[0];
  }
}
