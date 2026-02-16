import { SupaseContactsInterface } from './../../interfaces/supabase.interfaces';
import { Component, computed, inject, signal } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [KeyValuePipe],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  supabaseClientService = inject(Supabase);
  supabaseChannel: RealtimeChannel;
  dataUsers = signal<SupaseContactsInterface[]>([]);
  isLoading = signal(true);
  groupedUsers = computed(() => {
    const groups: Record<string, SupaseContactsInterface[]> = {};
    for (const person of this.dataUsers()) {
      const letter = person.name[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(person);
    }
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
  }

  async getDataInitial() {
    const data = (await this.supabaseClientService.getDataFromTable(
      'users',
    )) as SupaseContactsInterface[];
    this.dataUsers.set(data ?? []);
    this.isLoading.set(false);
  }

  ngOnDestroy() {
    this.supabaseChannel.unsubscribe();
  }
}
