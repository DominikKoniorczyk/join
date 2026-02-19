import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer-nav.html',
  styleUrl: './footer-nav.scss',
})
export class FooterNav {
  currentURL = signal<string>("");

  constructor(private router: Router){
    this.updateActiveURL(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {this.updateActiveURL(this.router.url)
      });
  }

  updateActiveURL(newUrl: string){
    this.currentURL.set(newUrl);
  }
}
