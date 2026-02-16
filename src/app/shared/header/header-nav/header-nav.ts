import { Component } from '@angular/core';
import { Help } from './help/help';
import { DropDown } from './drop-down/drop-down';

@Component({
  selector: 'app-header-nav',
  imports: [Help, DropDown],
  templateUrl: './header-nav.html',
  styleUrl: './header-nav.scss',
})
export class HeaderNav {}
