import { Routes } from '@angular/router';

export const analyticsRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Analytics' },
    loadComponent: () => import('./analytics-page/analytics-page').then(m => m.AnalyticsPage),
  },
];
