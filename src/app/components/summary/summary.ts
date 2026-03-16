import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskButtonComponent } from './task-button/task-button';
import { Supabase } from '../../services/supabase';
import { SupabaseContactsInterface } from '../../interfaces/supabase.interfaces';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule, TaskButtonComponent],
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss']
})
export class Summary {
  userName = signal<string>('Guest');
  greetingText = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  constructor(private supaBase: Supabase) {
    this.getUserName();
  }

  /**
   * Retrieves the current user's name from Supabase.
   * - If a user is logged in, fetches their full name and sets it in the `userName` signal.
   * - If no user is logged in, sets the `userName` signal to "Guest".
   *
   * @returns {Promise<void>}
   */
   async getUserName() {
    const user = await this.supaBase.getUser();
    const email = user?.email as string;
    if (user) {
      const loggedInUser = await this.supaBase.getLoggedInUser(email) as SupabaseContactsInterface[];
      this.userName.set(loggedInUser[0].name);
    }
    else this.userName.set("Guest");
  }
}
