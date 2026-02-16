import { Routes } from '@angular/router';
import { LegalNotice } from './pages/legal-notice/legal-notice';

export const routes: Routes = [
    { path: 'legal-notice', component: LegalNotice },
    {
        path: 'help',
        loadComponent: () =>
            import('./pages/help-text/help-text').then((m) => m.HelpText),
    },
];
