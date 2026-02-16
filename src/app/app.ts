import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { Contacts } from './components/contacts/contacts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Contacts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('join');
}
