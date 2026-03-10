import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth.service'; // Pfad ggf. anpassen!
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer-nav.html',
  styleUrl: './footer-nav.scss',
})
export class FooterNav {
  currentURL = signal<string>("");

  constructor(private router: Router, public auth: AuthService) {
    this.updateActiveURL(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveURL(this.router.url)
      });
  }

  updateActiveURL(newUrl: string) {
    this.currentURL.set(newUrl);
  }
  goTo(route: string) {
    this.router.navigate([route]);
  }
}
