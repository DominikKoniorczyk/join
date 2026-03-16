import { Component, inject, signal } from '@angular/core';
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

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.checkIsLoggedIn();
      });
  }

  ngAfterViewInit() {
    this.checkIsLoggedIn();
  }

  async checkIsLoggedIn() {
    const user = await this.supaBase.getUser();
    if (user || this.guest.isGuestUser()) {
      this.isLoggedIn.set(true);
    }
  }
}
