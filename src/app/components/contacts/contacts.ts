import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts{
  @Input() idToShow: number = 0;

  number!: number;
  name!: string;
  mail!: string;

  ngAfterViewInit(){

  }
}
