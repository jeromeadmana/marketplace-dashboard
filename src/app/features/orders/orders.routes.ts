import { Routes } from '@angular/router';

export const ordersRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Orders' },
    loadComponent: () => import('./order-list/order-list').then(m => m.OrderList),
  },
  {
    path: ':id',
    data: { breadcrumb: 'Order Detail' },
    loadComponent: () => import('./order-detail/order-detail').then(m => m.OrderDetail),
  },
];
