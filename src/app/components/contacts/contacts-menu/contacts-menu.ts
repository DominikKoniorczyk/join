import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseContactsInterface } from '../../../interfaces/supabase.interfaces';




@Component({
  selector: 'app-contacts-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-menu.html',
  styleUrls: ['./contacts-menu.scss']
})
export class ContactsMenu {

 @Input() person: SupabaseContactsInterface | null = null;


  @Output() deleteContact = new EventEmitter<number>();
  @Output() editContact = new EventEmitter<SupabaseContactsInterface>();

 onEdit() {
  if (!this.person) return;

  this.editContact.emit(this.person);
}

onDelete() {
  if (!this.person) return;

  const confirmDelete = confirm('Willst du diesen Kontakt wirklig löscen?');

  if (confirmDelete) {
    this.deleteContact.emit(this.person.id);
  }
}
}
