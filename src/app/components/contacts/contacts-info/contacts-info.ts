import { Component } from '@angular/core';
import { SupabaseContactsInterface } from '../../../interfaces/supabase.interfaces';

@Component({
  selector: 'app-contacts-info',
  imports: [],
  templateUrl: './contacts-info.html',
  styleUrl: './contacts-info.scss',
})
export class ContactsInfo {
  currentContact!: SupabaseContactsInterface;

  ngAfterViewInit() {

  }
}
