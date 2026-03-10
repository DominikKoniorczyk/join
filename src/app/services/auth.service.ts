import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  isLoggedIn = false;

//hier einschalten ob true oder false
  guestRestrictionEnabled = false;

  isGuest = false;

  loginAsGuest() {
    this.isGuest = true;
    localStorage.setItem('isGuest', 'true');
  }

  logout() {
    this.isGuest = false;
    localStorage.removeItem('isGuest');
  }

  checkIfGuest() {
    return localStorage.getItem('isGuest') === 'true';
  }


  isGuestUser(): boolean {
    return localStorage.getItem('isGuest') === 'true';
  }


  canAccess(): boolean {
    if (!this.guestRestrictionEnabled && this.isGuestUser()) return true;
    if (this.isGuestUser()) return true;
    return false ;
  }

  showGuestMessage = signal(false);


  handleGuestBlock(): void {
    if (!this.guestRestrictionEnabled) return;


    this.showGuestMessage.set(true);
    console.log('SHOW');

    setTimeout(() => {

      this.showGuestMessage.set(false);
      console.log('HIDE');
    }, 2000);
  }
}
