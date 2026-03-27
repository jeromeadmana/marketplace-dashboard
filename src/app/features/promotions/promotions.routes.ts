import { Routes } from '@angular/router';

export const promotionsRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Promotions' },
    loadComponent: () => import('./promotion-list/promotion-list').then(m => m.PromotionList),
  },
  {
    path: 'new',
    data: { breadcrumb: 'New Promotion' },
    loadComponent: () => import('./promotion-editor/promotion-editor').then(m => m.PromotionEditor),
  },
  {
    path: ':id',
    data: { breadcrumb: 'Promotion Detail' },
    loadComponent: () => import('./promotion-detail/promotion-detail').then(m => m.PromotionDetail),
  },
  {
    path: ':id/edit',
    data: { breadcrumb: 'Edit Promotion' },
    loadComponent: () => import('./promotion-editor/promotion-editor').then(m => m.PromotionEditor),
  },
];
