import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'help',
        loadComponent: () =>
            import('./pages/help-text/help-text').then((m) => m.HelpText),
    }
];
