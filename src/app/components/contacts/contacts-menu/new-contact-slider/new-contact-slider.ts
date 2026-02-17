import { Component } from '@angular/core';

@Component({
  selector: 'app-new-contact-slider',
  imports: [],
  templateUrl: './new-contact-slider.html',
  styleUrl: './new-contact-slider.scss',
})
export class NewContactSlider {
  colors: string[] = [
    '#ff7a00',
    '#ff5eb3',
    '#6e52ff',
    '#9327ff',
    '#00bee8',
    '#1fd7c1',
    '#ffa35e',
    '#fc71ff',
    '#ffc701',
    '#0038ff',
    '#c3ff2b',
    '#ffe62b',
    '#ff4646',
    '#ffbb2b'
  ];

  getRandomeColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}
