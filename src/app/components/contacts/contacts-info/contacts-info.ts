import { Component } from '@angular/core';
import { SupabaseContactsInterface } from '../../../interfaces/supabase.interfaces';
import { PhonePipe } from '../../../pipes/phonepipe-pipe';

@Component({
  selector: 'app-contacts-info',
  imports: [PhonePipe],
  templateUrl: './contacts-info.html',
  styleUrl: './contacts-info.scss',
})
export class ContactsInfo {
  currentContact!: SupabaseContactsInterface;
}
