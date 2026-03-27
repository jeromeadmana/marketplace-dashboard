import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Settings' },
    loadComponent: () => import('./settings-page/settings-page').then(m => m.SettingsPage),
  },
];
