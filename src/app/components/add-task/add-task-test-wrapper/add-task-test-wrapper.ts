import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsSelectorWithSearch } from '../taskform/contacts-selector-with-search/contacts-selector-with-search';

@Component({
  selector: 'app-add-task-test-wrapper',
  standalone: true,
  imports: [CommonModule, ContactsSelectorWithSearch],
  templateUrl: './add-task-test-wrapper.html',
  styleUrl: './add-task-test-wrapper.scss',
})
export class AddTaskTestWrapper {

  @ViewChild('test') el!: ContactsSelectorWithSearch;

  click(){
    if(this.el){
      this.el.closeOnOutsideClick();
    }
  }
}
