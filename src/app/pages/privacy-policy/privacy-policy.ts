import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {

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
