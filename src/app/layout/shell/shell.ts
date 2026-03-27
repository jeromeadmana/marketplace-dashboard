import { Component, inject, signal } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopbarComponent } from '../topbar/topbar';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs';
import { ToastComponent } from '../../shared/components/toast/toast';
import { routeAnimations } from './route-animations';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, BreadcrumbsComponent, ToastComponent],
  animations: [routeAnimations],
  template: `
    <app-sidebar
      [collapsed]="sidebarCollapsed()"
      (toggleCollapse)="sidebarCollapsed.update(v => !v)" />

    <app-topbar
      [sidebarCollapsed]="sidebarCollapsed()"
      (toggleSidebar)="sidebarCollapsed.update(v => !v)"
      (toggleMobileSidebar)="mobileSidebarOpen.update(v => !v)">
      <app-breadcrumbs breadcrumbs />
    </app-topbar>

    <main class="main-content" [style.margin-left]="sidebarCollapsed() ? '68px' : '260px'">
      <div [@routeAnimations]="getRouteAnimationData()">
        <router-outlet />
      </div>
    </main>

    <app-toast />
  `,
  styles: `
    .main-content {
      margin-top: 60px;
      padding: 1.5rem;
      min-height: calc(100vh - 60px);
      transition: margin-left 0.25s ease;
      position: relative;
    }

    @media (max-width: 768px) {
      .main-content { margin-left: 0 !important; }
    }
  `,
})
export class ShellComponent {
  readonly sidebarCollapsed = signal(false);
  readonly mobileSidebarOpen = signal(false);
  private readonly contexts = inject(ChildrenOutletContexts);

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.url.toString();
  }
}
