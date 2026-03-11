import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth.service'; // Pfad ggf. anpassen!
import { CommonModule } from '@angular/common';
import { Supabase } from '../../../services/supabase';
@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer-nav.html',
  styleUrl: './footer-nav.scss',
})
export class FooterNav {
  currentURL = signal<string>("");
  loggedIn = signal<boolean>(false);

  constructor(private router: Router, public auth: AuthService, private supabase: Supabase) {
    this.updateActiveURL(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveURL(this.router.url)
      });
    this.getIsLoggedIn();
  }

  /**
   * Checks whether a user is currently logged in using Supabase authentication.
   * Sets the `loggedIn` signal to true if a user is found.
   *
   * @returns {Promise<void>}
   */
  async getIsLoggedIn() {
    const user = await this.supabase.getUser();
    if (user) this.loggedIn.set(true);
  }

  /**
   * Updates the currently active URL in the local signal.
   *
   * @param {string} newUrl - The new URL to set as active.
   */
  updateActiveURL(newUrl: string) {
    this.currentURL.set(newUrl);
  }

  /**
   * Navigates to the specified route using the Angular router.
   *
   * @param {string} route - The route path to navigate to.
   */
  goTo(route: string) {
    this.router.navigate([route]);
  }

  /**
   * Determines whether all links should be shown based on user permissions.
   *
   * @returns {boolean} True if the user has access to all links, false otherwise.
   */
  getShowAllLinks(): boolean {
    if (this.auth.canAccess()) {
      return true;
    }
    else return false;
  }
}
