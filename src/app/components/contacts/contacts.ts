import { SupaseContactsInterface } from './../../interfaces/supabase.interfaces';
import { Component, computed, inject, signal } from '@angular/core';
import { Supabase } from '../../services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  supabaseClientService = inject(Supabase);
  supabaseChannel: RealtimeChannel;
  dataUsers = signal<SupaseContactsInterface[]>([]);
  isLoading = signal(true);
  colors: string[] = [
    '#ff7a00',
    '#ff5eb3',
    '#6e52ff',
    '#9327ff',
    '#00bee8',
    '#1fd7c1',
    '#ffa35e',
    '#fc71ff',
    '#ffc701',
    '#0038ff',
    '#c3ff2b',
    '#ffe62b',
    '#ff4646',
    '#ffbb2b'
  ];
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
    const data = await this.supabaseClientService.getDataFromTable('users') as SupaseContactsInterface[];
    this.dataUsers.set(data ?? []);
    this.isLoading.set(false);
  }

  getInitials(fullName: string): string {
    return fullName
      .trim()
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }

  getRandomeColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  ngOnDestroy() {
    this.supabaseChannel.unsubscribe();
  }
}
