import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { Contacts } from './components/contacts/contacts';
import { NewContactSlider } from './components/contacts/contacts-menu/new-contact-slider/new-contact-slider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet, Header, Footer, Contacts, NewContactSlider],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('join');

  router = inject(Router);   
}
