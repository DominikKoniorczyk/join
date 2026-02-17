import { SupabaseContactsInterface } from './../../interfaces/supabase.interfaces';
import { Component, computed, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { ContactsMenu } from './contacts-menu/contacts-menu';
import defaultContacts from '../../../../public/assets/JSON/defaultContacts.json';


@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactsMenu],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  @ViewChildren('contactBtn') allBtn!: QueryList<ElementRef<HTMLDivElement>>;

  supabaseClientService = inject(Supabase);
  supabaseChannel: RealtimeChannel;
  dataUsers = signal<SupabaseContactsInterface[]>([]);
  isLoading = signal(true);
  selectedContact = signal<SupabaseContactsInterface | null>(null);
  defaultContacts = defaultContacts;
  restoreDefaultContacts: boolean = false;
  groupedUsers = computed(() => {
    const groups = this.formGroups();
    return Object.keys(groups)
      .sort()
      .map((key) => ({
        key,
        value: groups[key].sort((a, b) => a.name.localeCompare(b.name)),
      }));
  });

  constructor() {
    this.getDataInitial();
    this.supabaseChannel = this.supabaseClientService.supabaseClient
      .channel('join')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        this.getDataInitial();
      })
      .subscribe();
    if (this.restoreDefaultContacts) setTimeout(() => this.restoreContactsToDefault(), 1000);
  }

  async restoreContactsToDefault() {
    for (let i = 0; this.dataUsers().length; i++) {
      this.supabaseClientService.deleteRow('users', this.dataUsers()[i].id);
    };
    this.supabaseClientService.uploadJSONToTable('users', this.defaultContacts);
  }

  async getDataInitial() {
    const data = await this.supabaseClientService.getDataFromTable('users') as SupabaseContactsInterface[];
    this.dataUsers.set(data ?? []);
    this.isLoading.set(false);
  }

  formGroups(){
    const groups: Record<string, SupabaseContactsInterface[]> = {};
    for (const person of this.dataUsers()) {
      const letter = person.name[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(person);
    }
    return groups;
  };

  getInitials(fullName: string): string {
    return fullName
      .trim()
      .split('')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }

  openContact(person: SupabaseContactsInterface, id: number) {
    this.selectedContact.set(person);
    this.removeActiveClass();
    const element = document.getElementById(id.toString());
    element?.classList.add('active_btn');
  }

  removeActiveClass(){
    this.allBtn.forEach(el => {
      el.nativeElement.classList.remove('active_btn');
    })
  }

  ngOnDestroy() {
    this.supabaseChannel.unsubscribe();
  }
}
