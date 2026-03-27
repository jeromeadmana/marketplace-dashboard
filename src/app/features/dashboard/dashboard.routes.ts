import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Dashboard' },
    loadComponent: () => import('./dashboard').then(m => m.DashboardComponent),
  },
];
