import { Routes } from '@angular/router';

export const reviewsRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Reviews' },
    loadComponent: () => import('./review-list/review-list').then(m => m.ReviewList),
  },
];
