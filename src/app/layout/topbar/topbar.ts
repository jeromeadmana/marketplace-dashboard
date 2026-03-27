import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, UpperCasePipe, ClickOutsideDirective, RelativeTimePipe],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class TopbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  protected readonly notifications = inject(NotificationService);

  readonly sidebarCollapsed = input(false);
  readonly toggleSidebar = output<void>();
  readonly toggleMobileSidebar = output<void>();

  protected showNotifications = signal(false);
  protected showUserMenu = signal(false);

  protected toggleNotificationPanel(): void {
    this.showNotifications.update(v => !v);
    this.showUserMenu.set(false);
  }

  protected toggleUserPanel(): void {
    this.showUserMenu.update(v => !v);
    this.showNotifications.set(false);
  }

  protected closeNotifications(): void {
    this.showNotifications.set(false);
  }

  protected closeUserMenu(): void {
    this.showUserMenu.set(false);
  }

  protected logout(): void {
    this.auth.logout();
    this.showUserMenu.set(false);
  }
}
