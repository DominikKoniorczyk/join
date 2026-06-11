import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { Help } from './help/help';
import { DropDown } from './drop-down/drop-down';
import { AuthService } from '../../../services/auth.service';
import { Supabase } from '../../../services/supabase';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header-nav',
  imports: [Help, DropDown],
  templateUrl: './header-nav.html',
  styleUrl: './header-nav.scss',
})
export class HeaderNav {
  isLoggedIn = signal<boolean>(false);
  supaBase = inject(Supabase);
  guest = inject(AuthService);
  @ViewChild('dropdown') dropdown!: DropDown;
  @ViewChild('dropdownEl', { read: ElementRef }) dropdownEl?: ElementRef<HTMLElement>;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.checkIsLoggedIn();
      });
  }

  /**
   * Handles clicks anywhere in the document and closes the dropdown
   * when the user clicks outside of the dropdown element.
   *
   * @param {MouseEvent} event - The click event triggered on the document.
   * @returns {void}
   */
   @HostListener('document:click', ['$event'])
   onDocumentClick(event: MouseEvent) {
    if (!this.dropdownEl?.nativeElement) {
      return;
    }
    if (!this.dropdownEl.nativeElement.contains(event.target as Node)) {
      this.dropdown.isDropDownOpen = false;
    }
  }

  /**
   * Angular lifecycle hook that is called after the component's view
   * and child views have been fully initialized.
   *
   * This hook triggers a login state check to determine whether the user
   * is currently authenticated or using a guest session.
   */
   ngAfterViewInit() {
    this.checkIsLoggedIn();
  }

  /**
   * Checks whether a user is currently logged in.
   *
   * The method retrieves the authenticated user from Supabase.
   * If a valid user session exists or a guest user is active,
   * the reactive `isLoggedIn` state is set to `true`.
   *
   * @returns {Promise<void>} Resolves when the authentication check is complete.
   */
   async checkIsLoggedIn() {
    const user = await this.supaBase.getUser();
    if (user || this.guest.isGuestUser()) {
      this.isLoggedIn.set(true);
    }
  }
}
