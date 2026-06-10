import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  imports: [],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.scss',
})
export class LegalNotice {

  constructor(private router: Router){}

  /**
   * Navigates to the specified route using the Angular router.
   *
   * @param {string} route - The route path to navigate to.
   */
  goTo(route: string) {
    this.router.navigate([route]);
  }
}
