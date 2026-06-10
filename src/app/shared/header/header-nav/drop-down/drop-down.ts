import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Supabase } from '../../../../services/supabase';
import { AuthService } from '../../../../services/auth.service';
import { ContactImage, SupabaseContactsInterface } from '../../../../interfaces/supabase.interfaces';
import { InitialsSelctorPipe } from '../../../../services/contacts.services';


@Component({
  selector: 'app-drop-down',
  imports: [RouterModule, InitialsSelctorPipe],
  templateUrl: './drop-down.html',
  styleUrl: './drop-down.scss',
})
export class DropDown {
  currentUserName = signal<string>("");
  currentUserImage = signal<ContactImage | null>(null);
  isDropDownOpen = false;
  loggedIn: boolean = false;

  constructor(private supaBase: Supabase, private route: Router, private auth: AuthService) {
    this.getUserName();
  }

  ngAfterViewInit() {
    this.getUserName();
  }

  /**
   * Toggles the visibility of the user dropdown menu.
   */
   toggleDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  /**
   * Retrieves the current user's name from Supabase and sets it in the local signal.
   * If no user is logged in, sets the name as "Guest".
   *
   * @returns {Promise<void>}
   */
   async getUserName() {
    const user = await this.supaBase.getUser();
    const email = user?.email as string;
    if (user) {
      const loggedInUser = await this.supaBase.getLoggedInUser(email) as SupabaseContactsInterface[];
      this.currentUserName.set(loggedInUser[0].name);
      this.currentUserImage.set(loggedInUser[0].image);
      this.loggedIn = true;
    }
    else if(this.auth.isGuestUser()){
      this.currentUserName.set("Guest");
      this.loggedIn = true;
    }
    else this.currentUserName.set("Guest")
  }

  /**
   * Logs out the current user.
   * Performs Supabase logout, clears auth session, and navigates to the login page.
   *
   * @returns {Promise<void>}
   */
   async logOut() {
    await this.supaBase.logOut();
    this.auth.logout();
    this.route.navigateByUrl('/login');
  }
}
