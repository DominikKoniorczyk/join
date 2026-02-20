import { SupabaseContactsInterface } from './../../../interfaces/supabase.interfaces';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  selectedPerson = signal<SupabaseContactsInterface>({ id: 0, created_at: "", name: "", email: "", phone_number: 0, color: "" });
  isEditing = false;

  /**
  * Enables edit mode for the currently selected person
  * and creates a copy of their data for editing.
  */
  onEdit() {
    if (!this.selectedPerson()) return;
    this.isEditing = true;
    this.editContact.emit(this.selectedPerson()!);
  }

  /**
   * Lifecycle hook that runs after the component's view has been initialized.
   * Sets the currently selected person to the component's `person` property.
   */
  ngAfterViewInit() {
    this.selectedPerson.set(this.person!);
  }

  /**
   * Updates the currently selected person.
   * @param person The person object to set as selected.
   */
  update(person: SupabaseContactsInterface) {
    this.selectedPerson.set(person);
  }

  /**
   * Deletes the currently selected person after user confirmation.
   * Emits the `deleteContact` event with the person's ID if confirmed.
   */
  onDelete() {
    if (!this.selectedPerson()) return;
    this.deleteContact.emit(this.selectedPerson()?.id);
  }
}
