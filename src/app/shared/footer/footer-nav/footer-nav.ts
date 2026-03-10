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

  async getIsLoggedIn(){
   const user = await this.supabase.getUser();
   if(user) this.loggedIn.set(true);
  }

  updateActiveURL(newUrl: string) {
    this.currentURL.set(newUrl);
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  getShowAllLinks(): boolean {
    if (this.auth.canAccess()) {
      return true;
    }
    else return false;
  }
}
