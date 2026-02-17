import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseContactsInterface } from '../../../interfaces/supabase.interfaces';

@Component({
  selector: 'app-contacts-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts-menu.html',
  styleUrls: ['./contacts-menu.scss']
})
export class ContactsMenu {

  @Input() person: SupabaseContactsInterface | null = null;

  @Output() deleteContact = new EventEmitter<number>();
  @Output() editContact = new EventEmitter<SupabaseContactsInterface>();

  
  isEditing = false;
  editableContact: SupabaseContactsInterface | null = null;


  onEdit() {
    if (!this.person) return;

    this.isEditing = true;

    
    this.editableContact = { ...this.person };
  }


  onSave() {
    if (!this.editableContact) return;

    this.editContact.emit(this.editableContact);
    this.isEditing = false;
  }


  onCancel() {
    this.isEditing = false;
    this.editableContact = null;
  }


  onDelete() {
    if (!this.person) return;

    const confirmDelete = confirm('Willt du diesen Kontakt wirklich löscen?');

    if (confirmDelete) {
      this.deleteContact.emit(this.person.id);
    }
  }

}
