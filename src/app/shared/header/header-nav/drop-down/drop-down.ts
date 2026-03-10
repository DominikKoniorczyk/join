import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Supabase } from '../../../../services/supabase';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-drop-down',
  imports: [RouterModule],
  templateUrl: './drop-down.html',
  styleUrl: './drop-down.scss',
})
export class DropDown {

  isDropDownOpen = false;

  toggleDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  constructor(private supaBase: Supabase, private route: Router, private auth: AuthService){}

  async logOut(){
   await this.supaBase.logOut();
   this.auth.logout();
   this.route.navigateByUrl('/login');
  }
}
