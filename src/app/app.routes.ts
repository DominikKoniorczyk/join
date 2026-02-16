import { Routes } from '@angular/router';
import { LegalNotice } from './pages/legal-notice/legal-notice';
import { Contacts } from './components/contacts/contacts';
import { Summary } from './components/summary/summary';
export const routes: Routes = [
    { path: 'legal-notice', component: LegalNotice },
     { path: 'summary', component: Summary },
     { path: 'contacts', component: Contacts }, 
    {
        path: 'help',
        loadComponent: () =>
            import('./pages/help-text/help-text').then((m) => m.HelpText),
    },
];
