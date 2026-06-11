import { Component, ViewChild, viewChild } from '@angular/core';
import { Help } from './header-nav/help/help';
import { DropDown } from './header-nav/drop-down/drop-down';
import { HeaderNav } from './header-nav/header-nav';

@Component({
  selector: 'app-header',
  imports: [HeaderNav],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
