import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseContactsInterface } from '../../../interfaces/supabase.interfaces';
import { PhonePipe } from '../../../pipes/phonepipe-pipe';
import { InitialsPipe } from '../../../services/contacts.services';

@Component({
  selector: 'app-contacts-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, PhonePipe, InitialsPipe],
  templateUrl: './contacts-menu.html',
  styleUrls: ['./contacts-menu.scss']
})
export class ContactsMenu {
  @Input() person: SupabaseContactsInterface | null = null;
  @Output() deleteContact = new EventEmitter<number>();
  @Output() editContact = new EventEmitter<SupabaseContactsInterface>();

  isEditing = false;
  editableContact: SupabaseContactsInterface | null = null;

  /**
  * Enables edit mode for the currently selected person
  * and creates a copy of their data for editing.
  */
  onEdit() {
    if (!this.person) return;
    this.isEditing = true;
    this.editableContact = { ...this.person };
    this.editContact.emit(this.person);
  }

  /**
   * Deletes the currently selected person after user confirmation.
   * Emits the `deleteContact` event with the person's ID if confirmed.
   */
  onDelete() {
    if (!this.person) return;
    const confirmDelete = confirm('Do you want to delete this user?');
    if (confirmDelete) {
      this.deleteContact.emit(this.person.id);
    }
  }

}
