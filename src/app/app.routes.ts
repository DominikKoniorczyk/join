import { Routes } from '@angular/router';
import { LogIn } from './components/log-in/log-in';
import { SignUp } from './components/sign-up/sign-up';
import { LegalNotice } from './pages/legal-notice/legal-notice';
import { Contacts } from './components/contacts/contacts';
import { Summary } from './components/summary/summary';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LogIn },
  { path: 'sign-up', component: SignUp},
  { path: 'summary', component: Summary },
  { path: 'contacts', component: Contacts },
  { path: 'legal-notice', component: LegalNotice },
  { path: 'privacy-policy', component: PrivacyPolicy },
  {
    path: 'help',
    loadComponent: () =>
      import('./pages/help-text/help-text').then((m) => m.HelpText),
  },
  { path: '**', redirectTo: 'login' },
];
