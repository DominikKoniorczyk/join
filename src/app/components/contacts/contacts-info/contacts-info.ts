import { Component } from '@angular/core';
import { SupaseContactsInterface } from '../../../interfaces/supabase.interfaces';

@Component({
  selector: 'app-contacts-info',
  imports: [],
  templateUrl: './contacts-info.html',
  styleUrl: './contacts-info.scss',
})
export class ContactsInfo {
  currentContact!: SupaseContactsInterface;

  ngAfterViewInit() {

  }
}
