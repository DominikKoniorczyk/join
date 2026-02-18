import { Routes } from '@angular/router';
import { LegalNotice } from './pages/legal-notice/legal-notice';
import { Contacts } from './components/contacts/contacts';
import { Summary } from './components/summary/summary';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';

export const routes: Routes = [
    { path: 'legal-notice', component: LegalNotice },
    { path: 'summary', component: Summary },
    { path: '', component: Contacts },  
    { path: 'contacts', component: Contacts },
    { path: 'privacy-policy', component: PrivacyPolicy },
    {
        path: 'help',
        loadComponent: () =>
            import('./pages/help-text/help-text').then((m) => m.HelpText),
    },
];
