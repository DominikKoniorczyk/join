import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../../../services/supabase';
import { SupabaseContactsInterface } from '../../../../interfaces/supabase.interfaces';

@Component({
  selector: 'app-contacts-selector-with-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-selector-with-search.html',
  styleUrl: './contacts-selector-with-search.scss',
})
export class ContactsSelectorWithSearch implements OnInit {
  @Output() selectedContactsChange = new EventEmitter<SupabaseContactsInterface[]>();


  private supabase = inject(Supabase);

  allContacts = signal<SupabaseContactsInterface[]>([]);
  @Input() selectedContacts: SupabaseContactsInterface[] = [];
  isOpen = false;
  searchTerm = signal('');

  filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const contacts = term
      ? this.allContacts().filter((c) => c.name.toLowerCase().includes(term))
      : this.allContacts();
    return [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  });

  /**
   * Closes the dropdown when clicking outside of it
   * and resets the current search term.
   */
  closeOnOutsideClick() {
    this.isOpen = false;
    this.searchTerm.set('');
  }

  /**
   * Angular lifecycle hook that runs after component initialization.
   * Fetches the list of contacts from the Supabase `users` table
   * and stores them in the local signal.
   *
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    const data = (await this.supabase.getDataFromTable('users')) as SupabaseContactsInterface[];
    this.allContacts.set(data ?? []);
  }

  /**
   * Toggles the visibility of the dropdown.
   * Clears the search term when the dropdown is closed.
   */
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.searchTerm.set('');
    }
  }

  /**
   * Adds or removes a contact from the selected contacts list.
   * Emits the updated list after the change.
   *
   * @param {SupabaseContactsInterface} contact - The contact to toggle.
   */
  toggleContact(contact: SupabaseContactsInterface) {
    const index = this.selectedContacts.findIndex((c) => c.id === contact.id);
    if (index === -1) {
      this.selectedContacts.push(contact);
    } else {
      this.selectedContacts.splice(index, 1);
    }
    this.selectedContactsChange.emit([...this.selectedContacts]);
  }

  /**
   * Checks whether a contact is currently selected.
   *
   * @param {SupabaseContactsInterface} contact - The contact to check.
   * @returns {boolean} True if the contact is selected, otherwise false.
   */
  isSelected(contact: SupabaseContactsInterface): boolean {
    return this.selectedContacts.some((c) => c.id === contact.id);
  }

  /**
   * Clears all selected contacts.
   */
  reset() {
    this.selectedContacts = []
  }

  /**
   * Generates initials from a given name.
   * If the name contains multiple words, the first letter of the first
   * and last word will be used.
   *
   * @param {string} name - The full name.
   * @returns {string} The generated initials in uppercase.
   */
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
