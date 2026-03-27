export type UserRole = 'admin' | 'manager' | 'viewer';

export interface Permission {
  resource: string;
  actions: ('read' | 'create' | 'update' | 'delete')[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  permissions: Permission[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'products', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'orders', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'customers', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'promotions', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'inventory', actions: ['read', 'update'] },
    { resource: 'reviews', actions: ['read', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] },
  ],
  manager: [
    { resource: 'products', actions: ['read', 'create', 'update'] },
    { resource: 'orders', actions: ['read', 'update'] },
    { resource: 'customers', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'promotions', actions: ['read', 'create', 'update'] },
    { resource: 'inventory', actions: ['read', 'update'] },
    { resource: 'reviews', actions: ['read', 'update'] },
    { resource: 'settings', actions: ['read'] },
  ],
  viewer: [
    { resource: 'products', actions: ['read'] },
    { resource: 'orders', actions: ['read'] },
    { resource: 'customers', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'promotions', actions: ['read'] },
    { resource: 'inventory', actions: ['read'] },
    { resource: 'reviews', actions: ['read'] },
    { resource: 'settings', actions: ['read'] },
  ],
};
