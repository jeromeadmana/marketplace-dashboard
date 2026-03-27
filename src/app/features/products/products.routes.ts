import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Products' },
    loadComponent: () => import('./product-list/product-list').then(m => m.ProductList),
  },
  {
    path: 'new',
    data: { breadcrumb: 'New Product' },
    loadComponent: () => import('./product-editor/product-editor').then(m => m.ProductEditor),
  },
  {
    path: ':id',
    data: { breadcrumb: 'Product Detail' },
    loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetail),
  },
  {
    path: ':id/edit',
    data: { breadcrumb: 'Edit Product' },
    loadComponent: () => import('./product-editor/product-editor').then(m => m.ProductEditor),
  },
];
