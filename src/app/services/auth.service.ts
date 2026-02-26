import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
}