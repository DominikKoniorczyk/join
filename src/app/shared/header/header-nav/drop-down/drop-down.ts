import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Supabase } from '../../../../services/supabase';


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

  constructor(private supaBase: Supabase, private route: Router){}

  async logOut(){
   await this.supaBase.logOut();
   this.route.navigateByUrl('/login');
  }
}
