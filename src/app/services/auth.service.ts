import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  guestRestrictionEnabled = false;
  isGuest = false;
  showGuestMessage = signal(false);

  /**
   * Logs in the user as a guest and sets a flag in local storage.
   */
  loginAsGuest() {
    this.isGuest = true;
    localStorage.setItem('isGuest', 'true');
  }

  /**
   * Logs out the guest user and removes the guest flag from local storage.
   */
  logout() {
    this.isGuest = false;
    localStorage.removeItem('isGuest');
  }

  /**
   * Checks whether the current session is a guest session.
   *
   * @returns {boolean} True if the user is a guest, otherwise false.
   */
  checkIfGuest() {
    return localStorage.getItem('isGuest') === 'true';
  }

  /**
   * Returns whether the current user is a guest.
   *
   * @returns {boolean} True if the user is a guest, otherwise false.
   */
  isGuestUser(): boolean {
    return localStorage.getItem('isGuest') === 'true';
  }

  /**
   * Determines whether the current user can access a restricted feature.
   *
   * @returns {boolean} True if access is allowed, otherwise false.
   */
  canAccess(): boolean {
    if (!this.guestRestrictionEnabled && this.isGuestUser()) return true;
    if (this.isGuestUser()) return true;
    return false;
  }

  /**
   * Handles guest user access restrictions by temporarily showing a message.
   * Message is displayed for 2 seconds when guest restrictions are enabled.
   */
  handleGuestBlock(): void {
    if (!this.guestRestrictionEnabled) return;
    this.showGuestMessage.set(true);
    setTimeout(() => {
      this.showGuestMessage.set(false);
    }, 2000);
  }
}
