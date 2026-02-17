import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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
}
