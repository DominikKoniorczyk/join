import { Component, computed, EventEmitter, inject, Input,  OnInit, Output, signal } from '@angular/core';
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

  closeOnOutsideClick() {
    this.isOpen = false;
    this.searchTerm.set('');
  }

  async ngOnInit() {
    const data = (await this.supabase.getDataFromTable('users')) as SupabaseContactsInterface[];
    this.allContacts.set(data ?? []);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.searchTerm.set('');
    }
  }

  toggleContact(contact: SupabaseContactsInterface) {
    const index = this.selectedContacts.findIndex((c) => c.id === contact.id);
    if (index === -1) {
      this.selectedContacts.push(contact);
    } else {
      this.selectedContacts.splice(index, 1);
    }
    this.selectedContactsChange.emit([...this.selectedContacts]);
  }

  isSelected(contact: SupabaseContactsInterface): boolean {
    return this.selectedContacts.some((c) => c.id === contact.id);
  }

  reset(){
    this.selectedContacts = []
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
