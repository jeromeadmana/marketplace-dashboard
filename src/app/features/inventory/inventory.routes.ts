import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Inventory' },
    loadComponent: () => import('./inventory-page/inventory-page').then(m => m.InventoryPage),
  },
];
