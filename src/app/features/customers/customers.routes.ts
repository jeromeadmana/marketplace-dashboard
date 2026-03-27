import { Routes } from '@angular/router';

export const customersRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Customers' },
    loadComponent: () => import('./customer-list/customer-list').then(m => m.CustomerList),
  },
  {
    path: ':id',
    data: { breadcrumb: 'Customer Detail' },
    loadComponent: () => import('./customer-detail/customer-detail').then(m => m.CustomerDetail),
  },
];
