import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseContactsInterface } from '../../../interfaces/supabase.interfaces';
import { PhonePipe } from '../../../pipes/phonepipe-pipe';

@Component({
  selector: 'app-contacts-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, PhonePipe],
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
   * Saves the changes made to the editable contact.
   * Emits the `editContact` event with the updated contact data
   * and exits edit mode.
   */
  onSave() {
    if (!this.editableContact) return;
    this.editContact.emit(this.editableContact);
    this.isEditing = false;
  }

  /**
   * Cancels the editing process, discards changes,
   * and exits edit mode.
   */
  onCancel() {
    this.isEditing = false;
    this.editableContact = null;
  }

  /**
   * Generates uppercase initials from a full name string.
   *
   * Example: 'John Doe' => 'JD'
   * @param fullName The full name of the person.
   * @returns A string containing the uppercase initials.
   */
  getInitials(fullName: string): string {
    return fullName
      .trim()
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
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
