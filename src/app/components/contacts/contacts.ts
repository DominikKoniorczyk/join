import { NewContactsInterface, SupabaseContactsInterface } from './../../interfaces/supabase.interfaces';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Supabase } from '../../services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { ContactsMenu } from './contacts-menu/contacts-menu';
import defaultContacts from '../../../../public/assets/JSON/defaultContacts.json';
import { InitialsPipe } from '../../services/contacts.services';
import { NewContactSlider } from './contacts-menu/new-contact-slider/new-contact-slider';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactsMenu, InitialsPipe, NewContactSlider],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  @ViewChildren('contactBtn') allBtn!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChild('contactModal') contactsModal!: NewContactSlider;

  supabaseClientService = inject(Supabase);
  supabaseChannel: RealtimeChannel;
  dataUsers = signal<SupabaseContactsInterface[]>([]);
  isLoading = signal(true);
  selectedContact = signal<SupabaseContactsInterface | null>(null);
  defaultContacts = defaultContacts;
  restoreDefaultContacts: boolean = false;
  contactsDetailOpen = signal(false);
  responsiveDetailsOpen = signal(false);
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
    this.supabaseChannel = this.supabaseClientService.supabaseClient.channel('custom-all-channel');
  }

  /**
   * Initializes the component, sets up a Supabase realtime listener for user changes,
   * and optionally restores default contacts after a short delay.
   */
  ngOnInit() {
    this.supabaseChannel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        this.getDataInitial();
      })
      .subscribe();
    if (this.restoreDefaultContacts) setTimeout(() => this.restoreContactsToDefault(), 1000);
    this.onResize();
  }

  /**
   * Restores the user contacts table to the default contacts.
   * Deletes all current user rows and uploads the default contacts.
   */
  async restoreContactsToDefault() {
    for (let i = 0; this.dataUsers().length; i++) {
      this.supabaseClientService.deleteRow('users', this.dataUsers()[i].id);
    }
    this.supabaseClientService.uploadJSONToTable('users', this.defaultContacts);
  }

  /**
   * Fetches the initial user data from the 'users' table and updates the local state.
   */
  async getDataInitial() {
    const data = (await this.supabaseClientService.getDataFromTable(
      'users',
    )) as SupabaseContactsInterface[];
    this.dataUsers.set(data ?? []);
    this.isLoading.set(false);
  }

  /**
   * Groups user contacts by the first letter of their name.
   * @returns A record where each key is an uppercase letter and the value is an array of contacts starting with that letter.
   */
  formGroups() {
    const groups: Record<string, SupabaseContactsInterface[]> = {};
    for (const person of this.dataUsers()) {
      const letter = person.name[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(person);
    }
    return groups;
  }

  /**
   * Updates a specific field of the currently selected contact.
   * @param key The field key to update.
   * @param value The new value for the specified field.
   */
  updateField(key: string, value: any) {
    this.selectedContact.update((current) => {
      if (!current) return current;
      return { ...current, name: value };
    });
  }

  /**
   * Opens a contact by setting it as the selected contact
   * and applying an active CSS class to its corresponding element.
   * @param person The contact to open.
   * @param id The DOM element ID associated with this contact.
   */
  openContact(person: SupabaseContactsInterface, id: number) {
    this.selectedContact.set(person);
    this.contactsDetailOpen.set(this.responsiveDetailsOpen());
    this.removeActiveClass();
    const element = document.getElementById(id.toString());
    element?.classList.add('active_btn');
  }

  /**
   * Removes the active CSS class from all buttons.
   */
  removeActiveClass() {
    this.allBtn.forEach((el) => {
      el.nativeElement.classList.remove('active_btn');
    });
  }

  /**
   * Opens the "Add Contact" dialog if it exists and is a valid HTMLDialogElement.
   */
  openNewContact() {
    const dialogRef = document.getElementById('addContactModal');
    if (dialogRef instanceof HTMLDialogElement) {
      dialogRef.showModal();
    }
  }

  /**
   * Closes the "Add Contact" dialog if it exists and is a valid HTMLDialogElement.
   */
  closeDialog() {
    const dialogRef = document.getElementById('addContactModal');
    if (dialogRef instanceof HTMLDialogElement) {
      dialogRef.classList.add('closed');
      setTimeout(() => {
        dialogRef.close();
        dialogRef.classList.remove('closed');
      }, 300);
    }
  }

  deleteUser(id: number) {
    this.supabaseClientService.deleteRow('users', id);
    this.selectedContact.set(null);
  }

  @HostListener('window:resize')
  onResize() {
    this.responsiveDetailsOpen.set(window.innerWidth <= 1100);
  }
  /**
   * Cleans up resources when the component is destroyed,
   * specifically unsubscribing from the Supabase realtime channel.
   */
  ngOnDestroy() {
    this.supabaseChannel.unsubscribe();
  }

  editContact(contact: SupabaseContactsInterface){
    if(contact){
      this.contactsModal.editingContact = contact;
      this.contactsModal.checkIsEditing();
      this.openNewContact();
    }
  }

  triggerUxFeedback() {
    setTimeout(() => {
      const notificationRef = document.getElementById('uxFeedbackNotification');
      if (notificationRef instanceof HTMLDialogElement) {
        notificationRef.showModal();
        notificationRef.classList.add('active');
        setTimeout(() => {
          notificationRef.classList.remove('active');
          notificationRef.close();
        }, 2500);
      }
    }, 302);
  }
}
