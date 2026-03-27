import { Component, input, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  permission?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  private readonly auth = inject(AuthService);

  readonly collapsed = input(false);
  readonly toggleCollapse = output<void>();

  readonly navGroups: NavGroup[] = [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', icon: '📊', route: '/dashboard' },
        { label: 'Analytics', icon: '📈', route: '/analytics', permission: 'analytics.read' },
      ],
    },
    {
      label: 'Catalog',
      items: [
        { label: 'Products', icon: '📦', route: '/products', permission: 'products.read' },
        { label: 'Inventory', icon: '🏭', route: '/inventory', permission: 'inventory.read' },
        { label: 'Reviews', icon: '⭐', route: '/reviews', permission: 'reviews.read' },
      ],
    },
    {
      label: 'Sales',
      items: [
        { label: 'Orders', icon: '🛒', route: '/orders', permission: 'orders.read' },
        { label: 'Customers', icon: '👥', route: '/customers', permission: 'customers.read' },
        { label: 'Promotions', icon: '🏷️', route: '/promotions', permission: 'promotions.read' },
      ],
    },
    {
      label: 'System',
      items: [
        { label: 'Settings', icon: '⚙️', route: '/settings', permission: 'settings.read' },
      ],
    },
  ];

  hasPermission(item: NavItem): boolean {
    if (!item.permission) return true;
    const [resource, action] = item.permission.split('.');
    return this.auth.hasPermission(resource, action as 'read');
  }
}
