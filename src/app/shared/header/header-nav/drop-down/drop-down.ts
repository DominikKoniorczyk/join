import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Supabase } from '../../../../services/supabase';
import { AuthService } from '../../../../services/auth.service';
import { SupabaseContactsInterface } from '../../../../interfaces/supabase.interfaces';
import { InitialsSelctorPipe } from '../../../../services/contacts.services';


@Component({
  selector: 'app-drop-down',
  imports: [RouterModule, InitialsSelctorPipe],
  templateUrl: './drop-down.html',
  styleUrl: './drop-down.scss',
})
export class DropDown {
  currentUserName = signal<string>("");
  isDropDownOpen = false;

  toggleDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  constructor(private supaBase: Supabase, private route: Router, private auth: AuthService) {
    this.getUserName();
  }

  async getUserName() {
    const user = await this.supaBase.getUser();
    const email = user?.email as string;
    if (user) {
      const loggedInUser = await this.supaBase.getLoggedInUser(email) as SupabaseContactsInterface[];
      this.currentUserName.set(loggedInUser[0].name);
    }
    else this.currentUserName.set("Guest ");
  }

  async logOut() {
    await this.supaBase.logOut();
    this.auth.logout();
    this.route.navigateByUrl('/login');
  }
}
